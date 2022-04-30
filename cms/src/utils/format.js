import moment from 'moment';

class Format {
  static defaultDateFormat = 'MM/DD/YYYY';

  static defaultTimeFormat = 'hh:mmA';

  static defaultDateTimeFormat = 'MM/DD/YYYY hh:mmA';

  static defaultActiveFormat = 'Active';

  static defaultInactiveFormat = 'Inactive';

  static defaultSelectLabel = 'None';

  static dateFormat(field = null, format = this.defaultDateFormat) {
    let output = '';
    try {
      output = field ? moment(field).format(format) : '';
    } catch (e) {
      output = '';
    }
    return output;
  }

  static timeFormat(field = null, format = this.defaultTimeFormat) {
    let output = '';
    try {
      output = field ? moment(field).format(format) : '';
    } catch (e) {
      output = '';
    }
    return output;
  }

  static dateTimeFormat(field = null, format = this.defaultDateTimeFormat) {
    let output = '';
    try {
      output = field ? moment(field).format(format) : '';
    } catch (e) {
      output = '';
    }
    return output;
  }

  static activeInactiveFormat(
    field = null,
    activeFormat = this.defaultActiveFormat,
    inactiveFormat = this.defaultInactiveFormat
  ) {
    let output = '';
    if (typeof field !== 'undefined') {
      output = field ? activeFormat : inactiveFormat;
    }
    return output;
  }

  static defaultSelectFormat(label = this.defaultSelectLabel, value = '') {
    return {
      value,
      label
    };
  }
}

export default Format;
