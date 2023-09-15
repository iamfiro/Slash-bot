export function numberWithCommas(x: number | bigint) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertMillisecondsToHMS(milliseconds: number): { hours: number, minutes: number, seconds: number } {
    const millisecondsPerSecond = 1000;
    const secondsPerMinute = 60;
    const minutesPerHour = 60;

    const totalSeconds = Math.floor(milliseconds / millisecondsPerSecond);
    const hours = Math.floor(totalSeconds / (secondsPerMinute * minutesPerHour));
    const minutes = Math.floor((totalSeconds % (secondsPerMinute * minutesPerHour)) / secondsPerMinute);
    const seconds = (totalSeconds % (secondsPerMinute * minutesPerHour)) % secondsPerMinute;

    return { hours, minutes, seconds };
}