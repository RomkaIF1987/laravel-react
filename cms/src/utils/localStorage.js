const developmentMode = process.env.REACT_APP_ENV;

class LocalStorage {
  static encrypt(str) {
    if (developmentMode === "development") {
      return str;
    }
    try {
      return btoa(
        // eslint-disable-next-line
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode(`0x${p1}`);
        })
      );
    } catch (e) {
      return null;
    }
  }

  static decrypt(str) {
    if (developmentMode === "development") {
      return str;
    }
    try {
      return decodeURIComponent(
        Array.prototype.map
          // eslint-disable-next-line
          .call(atob(str), function (c) {
            return `%${c.charCodeAt(0).toString(16)}`;
          })
          .join("")
      );
    } catch (e) {
      return null;
    }
  }

  static setItem(key, myObject) {
    const oldObject = localStorage.getItem("RZSettings") ? LocalStorage.getItems() : {};
    const newObject = { ...oldObject, ...{ [key]: myObject } };
    localStorage.setItem("RZSettings", LocalStorage.encrypt(JSON.stringify(newObject)));
    return true;
  }

  static getItems() {
    const myObject = localStorage.getItem("RZSettings") || null;
    return myObject ? JSON.parse(LocalStorage.decrypt(myObject)) : null;
  }

  static getItem(key) {
    const myObject = LocalStorage.getItems();
    return myObject && Object.prototype.hasOwnProperty.call(myObject, key) ? myObject[key] : null;
  }

  static hasItem(key) {
    const myObject = LocalStorage.getItems();
    return myObject && Object.prototype.hasOwnProperty.call(myObject, key);
  }

  static removeItem(key) {
    const myObject = LocalStorage.getItems();
    if (myObject !== null && this.hasItem(key)) {
      delete myObject[key];
      localStorage.setItem("RZSettings", LocalStorage.encrypt(JSON.stringify(myObject)));
    }
    return true;
  }
}

export default LocalStorage;
