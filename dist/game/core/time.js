export const createInitialTime = () => ({ day: 1 });
export const advanceDay = (time, step = 1) => ({
    day: time.day + step,
});
