/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-regex-literals */
/* eslint-disable global-require */
// eslint-disable-next-line import/no-cycle,max-classes-per-file
import jwtService from "../services/jwtService/jwtService";
import _ from "./lodash";
import LocalStorage from "./localStorage";
import authConfig from "../config/authConfig";

const superAdminRole = authConfig.superAdmin;
const proAdminRole = authConfig.proAdmin;

class EventEmitter {
  constructor() {
    this.events = {};
  }

  // eslint-disable-next-line no-underscore-dangle
  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === "undefined") {
      this.events[eventName] = new Set();
    }
    return this.events[eventName];
  }

  on(eventName, fn) {
    this._getEventListByName(eventName).add(fn);
  }

  once(eventName, fn) {
    const self = this;

    const onceFn = (...args) => {
      self.removeListener(eventName, onceFn);
      fn.apply(self, args);
    };
    this.on(eventName, onceFn);
  }

  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(
      // eslint-disable-next-line func-names
      (fn) => {
        fn.apply(this, args);
      }
    );
  }

  removeListener(eventName, fn) {
    this._getEventListByName(eventName).delete(fn);
  }
}

class Helper {
  static EventEmitter = EventEmitter;

  static filterArrayByString(mainArr, searchText) {
    if (searchText === "") {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter((itemObj) => this.searchInObj(itemObj, searchText));
  }

  static searchInObj(itemObj, searchText) {
    if (!itemObj) {
      return false;
    }

    const propArray = Object.keys(itemObj);

    for (let i = 0; i < propArray.length; i += 1) {
      const prop = propArray[i];
      const value = itemObj[prop];

      if (typeof value === "string") {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === "object") {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  static searchInArray(arr, searchText) {
    arr.forEach((value) => {
      if (typeof value === "string") {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }

      if (typeof value === "object") {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
      return false;
    });
    return false;
  }

  static searchInString(value, searchText) {
    return value.toLowerCase().includes(searchText);
  }

  static generateGUID() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  static toggleInArray(item, array) {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  static handleize(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/\W+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  static setRoutes(config, routesConfig, defaultAuth) {
    let routes = [...config.routes];
    let configPath = config.path || "";

    let parent = null;
    routesConfig.forEach((bucketItem) => {
      if (bucketItem.children && bucketItem.children.length > 0) {
        bucketItem.children.forEach((child) => {
          if (child.path === configPath) {
            parent = bucketItem;
          }
        });
      }
    });

    if (parent) {
      configPath = `${parent.path}${configPath}`;
    }

    routes = routes.map((route) => {
      let roles = config.roles || config.roles === null ? config.roles : defaultAuth || null;
      roles = route.roles || route.roles === null ? route.roles : roles;
      let permissions =
        config.permissions || config.permissions === null ? config.permissions : defaultAuth || [];
      permissions =
        route.permissions || route.permissions === null ? route.permissions : permissions;
      const settings = _.merge({}, config.settings, route.settings);

      const path = `${configPath}${route.path}`;
      return {
        ...route,
        path,
        settings,
        roles,
        permissions,
        parent,
      };
    });

    return [...routes];
  }

  static generateRoutesFromConfigs(routesList, routesConfig, defaultAuth) {
    let allRoutes = [];
    if (routesConfig.length > 0) {
      routesConfig.forEach((routeConfig) => {
        if (!routeConfig.type) {
          allRoutes.push(routeConfig);
        }
      });
    }
    routesList.forEach((routeItemConfig) => {
      allRoutes = [...allRoutes, ...this.setRoutes(routeItemConfig, routesConfig, defaultAuth)];
    });

    if (routesConfig.length > 0) {
      routesConfig.forEach((routeConfig) => {
        if (routeConfig.children && routeConfig.children.length > 0) {
          routeConfig.children.forEach((routeChild) => {
            if (routeChild.type === "link" && routeChild.component) {
              allRoutes.push({
                ...routeChild,
                parent: routeConfig,
              });
            } else if (!routeChild.type && routeChild.component) {
              const path = `${routeConfig.path}${routeChild.path}`;
              allRoutes.push({
                ...routeChild,
                path,
                parent: routeConfig,
              });
            }
          });
        }
      });
    }
    allRoutes = _.uniqBy(allRoutes, "path");
    return allRoutes;
  }

  static buildNavigationsConfigItem(routeConfig) {
    const id = routeConfig.id || `id.${_.random(1, 10000)}`;
    const title = routeConfig?.metadata?.title || "";
    const type = routeConfig.children && routeConfig.children.length > 0 ? "flyout" : "item";
    const url = routeConfig.path || "/";
    const roles = routeConfig.roles || null;
    const permissions = routeConfig.permissions || [];
    const includeInNavigation =
      typeof routeConfig?.metadata?.navigation !== "undefined"
        ? routeConfig.metadata.navigation
        : true;
    return {
      id,
      title,
      type,
      url,
      roles,
      permissions,
      includeInNavigation,
    };
  }

  static buildNavigationsConfig(routesConfig, routes) {
    const navigationConfig = [];
    if (routesConfig && routesConfig.length) {
      routesConfig.forEach((routeConfig) => {
        if (routeConfig.type === "routeRef" && routeConfig.routeRef) {
          const routeRef = routes.find((r) => r.id === routeConfig.routeRef);
          routeConfig = {
            ...routeRef,
            ...routeConfig,
          };
        }
        const navigationItem = this.buildNavigationsConfigItem(routeConfig);
        if (routeConfig.children && routeConfig.children.length > 0) {
          navigationItem.children = routeConfig.children
            .map((routeChild) => {
              let routeChildNewState = { ...routeChild };
              if (routeChild.type === "routeRef" && routeChild.routeRef) {
                const routeRef = routes.find((r) => r.id === routeChild.routeRef);
                routeChildNewState = {
                  ...routeRef,
                  ...routeChild,
                };
              } else if (!routeChild.type) {
                let path = `${routeChild?.path || ""}`;
                if (routeConfig?.path && !routeConfig.type) {
                  path = `${routeConfig?.path || ""}${path}`;
                }
                routeChildNewState = {
                  ...routeChild,
                  path,
                };
              }
              const navigationItemChild = this.buildNavigationsConfigItem(routeChildNewState);
              if (navigationItemChild.includeInNavigation && navigationItemChild.title) {
                return navigationItemChild;
              }
              return null;
            })
            .filter((routeChild) => routeChild);
        }
        if (navigationItem.includeInNavigation && navigationItem.title) {
          navigationConfig.push(navigationItem);
        }
      });
    }
    return navigationConfig;
  }

  static getFlatNavigation(navigationItems, flatNavigation = []) {
    for (let i = 0; i < navigationItems.length; i += 1) {
      const navItem = navigationItems[i];

      if (navItem.type === "item") {
        flatNavigation.push({
          id: navItem.id,
          title: navItem.title,
          type: navItem.type,
          icon: navItem.icon || false,
          url: navItem.url,
          roles: navItem.roles || null,
          permissions: navItem.permissions || [],
        });
      }

      if (navItem.type === "collapse" || navItem.type === "group") {
        if (navItem.children) {
          this.getFlatNavigation(navItem.children, flatNavigation);
        }
      }
    }
    return flatNavigation;
  }

  static difference(object, base) {
    function changes(_object, _base) {
      return _.transform(_object, (result, value, key) => {
        if (!_.isEqual(value, _base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(_base[key]) ? changes(value, _base[key]) : value;
        }
      });
    }

    return changes(object, base);
  }

  static updateNavItem(nav, id, item) {
    return nav.map((_item) => {
      if (_item.id === id) {
        return _.merge({}, _item, item);
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.updateNavItem(_item.children, id, item),
        });
      }

      return _.merge({}, _item);
    });
  }

  static removeNavItem(nav, id) {
    return nav
      .map((_item) => {
        if (_item.id === id) {
          return null;
        }

        if (_item.children) {
          return _.merge({}, _.omit(_item, ["children"]), {
            children: this.removeNavItem(_item.children, id),
          });
        }

        return _.merge({}, _item);
      })
      .filter((s) => s);
  }

  static prependNavItem(nav, item, parentId) {
    if (!parentId) {
      return [item, ...nav];
    }

    return nav.map((_item) => {
      if (_item.id === parentId && _item.children) {
        return {
          _item,
          children: [item, ..._item.children],
        };
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.prependNavItem(_item.children, item, parentId),
        });
      }

      return _.merge({}, _item);
    });
  }

  static appendNavItem(nav, item, parentId) {
    if (!parentId) {
      return [...nav, item];
    }

    return nav.map((_item) => {
      if (_item.id === parentId && _item.children) {
        return {
          ..._item,
          children: [..._item.children, item],
        };
      }

      if (_item.children) {
        return _.merge({}, _item, {
          children: this.appendNavItem(_item.children, item, parentId),
        });
      }

      return _.merge({}, _item);
    });
  }

  static findById(obj, id) {
    let i;
    let childObj;
    let result;

    if (id === obj.id) {
      return obj;
    }

    for (i = 0; i < Object.keys(obj).length; i += 1) {
      childObj = obj[Object.keys(obj)[i]];

      if (typeof childObj === "object") {
        result = this.findById(childObj, id);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }

  static hasRole(authRoles, authPermissions = [], userRoleId, userRolePermissions = []) {
    /**
     * If auth array is not defined
     * Pass and allow
     */
    if (authRoles === null || authRoles === undefined) {
      // console.info("auth is null || undefined:", authRoles);
      return true;
    }
    if (authRoles.length === 0) {
      /**
       * if auth array is empty means,
       * allow only user role is guest (empty[])
       */
      // console.info("auth is empty[]:", authRoles);
      return !userRoleId || userRoleId.length === 0;
    }

    /*
    Check if user role is Super Admin or Pro Admin.
    */
    if (userRoleId && (userRoleId === superAdminRole || userRoleId === proAdminRole)) {
      return authRoles.includes(userRoleId);
    }

    /*
    Check if user has role and has permissions.
    */
    if (
      userRoleId &&
      userRoleId.length !== 0 &&
      userRolePermissions &&
      userRolePermissions.length !== 0
    ) {
      if (!authPermissions) {
        return true;
      }
      return (
        authRoles.includes(proAdminRole) &&
        authPermissions &&
        authPermissions.every((r) => userRolePermissions.includes(r))
      );
    }

    /*
    Check if user role is string,
    */
    return authRoles.includes(userRoleId);
  }

  static checkUserRoles(requiredRoles = []) {
    if (typeof requiredRoles === "string") {
      requiredRoles = [requiredRoles];
    }
    const user = jwtService.getUserInfo();
    if (user && user?.role_id) {
      if (user.role_id === superAdminRole) {
        return true;
      }
      this.hasRole(requiredRoles, user.role);
    }
    return false;
  }

  static checkUserRoleSuperadmin() {
    const user = jwtService.getUserInfo();
    if (user?.role_id) {
      return user.role_id === superAdminRole;
    }
    return false;
  }

  static filterRecursive(data, predicate) {
    // if no data is sent in, return null, otherwise transform the data
    return !data
      ? null
      : data.reduce((list, entry) => {
          let clone = null;
          if (predicate(entry)) {
            // if the object matches the filter, clone it as it is
            clone = { ...entry };
          }
          if (clone && entry.children != null) {
            // if the object has childrens, filter the list of children
            const children = this.filterRecursive(entry.children, predicate);
            // if any of the children matches, clone the parent object, overwrite
            // the children list with the filtered list
            clone = {
              ...entry,
              children,
            };
          }

          // if there's a cloned object, push it to the output list
          clone && list.push(clone);
          return list;
        }, []);
  }

  static navigationSetRouterRolesRecursively(data, routers) {
    // if no data is sent in, return null, otherwise transform the data
    return !data
      ? null
      : data.reduce((list, entry) => {
          let clone = null;
          if (!entry.roles) {
            const route = routers.find((r) => r.path === entry.url);
            clone = route && route.roles ? { ...entry, roles: route.roles } : { ...entry };
          } else {
            clone = { ...entry };
          }
          if (entry.children != null) {
            // if the object has childrens, filter the list of children
            const children = this.navigationSetRouterRolesRecursively(entry.children, routers);
            // if any of the children matches, clone the parent object, overwrite
            // the children list with the filtered list
            clone = {
              ...clone,
              children,
            };
          }

          // if there's a cloned object, push it to the output list
          clone && list.push(clone);
          return list;
        }, []);
  }

  static emailValidate(email) {
    const emailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(String(email).toLowerCase());
  }

  static passwordGenerate() {
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const pwdLen = 8;
    return Array(pwdLen)
      .fill(pwdChars)
      .map((x) => x[Math.floor(Math.random() * x.length)])
      .join("");
  }

  static getRequestParams() {
    const {
      match: { params: routerParams = {} },
    } = LocalStorage.getItem("NpgRouter");
    return routerParams;
  }

  static getRequestPath() {
    let {
      match: { path: routerPath = "" },
    } = LocalStorage.getItem("NpgRouter");
    routerPath = _.trim(routerPath, "/");
    return routerPath;
  }

  static getRequestRouter() {
    const router = LocalStorage.getItem("NpgRouter");
    return router;
  }

  static queryStringToObject(queryString) {
    const searchParams = new URLSearchParams(queryString);
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const pair of searchParams.entries()) {
      const [key, value] = pair;
      object[key] = value;
    }
    return object;
  }

  static objectToQueryString(object) {
    const string = new URLSearchParams(object).toString();
    return `?${string}`;
  }

  static userRoleTitle(role) {
    let roleTitle = "";
    if (role !== undefined && role.length > 0) {
      if ((role.isArray && role.toString() === "superadmin") || role === "superadmin") {
        roleTitle = "Super Admin";
      } else if (role.includes("_")) {
        let words = _.words(role.replace("_", " "));
        words = words.map((word) => _.upperFirst(word));
        roleTitle = words.join(" ");
      } else {
        roleTitle = _.upperFirst(role);
      }
    }
    return roleTitle;
  }

  static setPageTitle(props, record = null) {
    const defaultTitle = process.env.REACT_APP_NAME;
    let pageTitle = "";
    const lastRoutesSettings = props?.routesSettings ? _.last(props.routesSettings) : null;
    const metadata = lastRoutesSettings?.metadata || {};
    let { pageTitle: settingsPageTitle = null } = metadata;
    const { title = null } = metadata;
    settingsPageTitle = settingsPageTitle || title;
    if (settingsPageTitle) {
      if (settingsPageTitle && typeof settingsPageTitle === "function") {
        pageTitle = settingsPageTitle(record);
      } else if (settingsPageTitle && typeof settingsPageTitle === "string") {
        pageTitle = settingsPageTitle;
      }
    }
    document.title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  }

  static checkDisabledId(disabledIds, id, type) {
    if (
      disabledIds &&
      id &&
      // eslint-disable-next-line no-prototype-builtins
      disabledIds.hasOwnProperty(id) &&
      Object.keys(disabledIds).find((element) => parseInt(element, 10) === id)
    ) {
      if (disabledIds[id].find((element) => element === "all") !== undefined) {
        return true;
      }
      return disabledIds[id].find((element) => element === type) !== undefined;
    }
    return false;
  }

  static generateHashUid() {
    const crypto = require("crypto");
    return crypto.randomBytes(5).toString("hex");
  }
}

export default Helper;
