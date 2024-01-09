import { Injectable } from '@nestjs/common';

@Injectable()
export class Helper {
  // Function to convert date from Unix
  changeDateFormat(NewRowsdate: any) {
    const newDate = new Date((NewRowsdate - 25569) * 86400 * 1000);
    return newDate;
  }

  // Function to convert Date timestamp to Unix
  convertToUnixTimestamp(timestamp: Date): number {
    const dateObject = new Date(timestamp);
    const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
    return unixTimestamp;
  }

  convertToDDMMMYY(dateObject: Date) {
    if (!dateObject || typeof dateObject === 'string') {
      return null;
    }
    const day = dateObject.getUTCDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getUTCFullYear().toString().substr(-2);

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  formatExpiryTime(expiryTime: string): string {
    const match = expiryTime.match(/(\d+)([hmds])/);

    if (match) {
      const [, value, unit] = match;
      const numericValue = parseInt(value, 10);

      switch (unit) {
        case 'h':
          return `${numericValue} hours`;
        case 'm':
          return `${numericValue} minutes`;
        case 'd':
          return `${numericValue} days`;
        default:
          return null;
      }
    }

    return null;
  }

  getDateForMonths(months: number) {
    const dateObj = new Date();

    // Calculate the date before `period` months
    const requiredDate = new Date(dateObj);
    requiredDate.setMonth(dateObj.getMonth() - months);
    requiredDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
    return requiredDate;
  }
}
