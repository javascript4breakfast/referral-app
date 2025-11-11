export const rate = (num: number, den: number) =>
    den === 0 ? 0 : Number(((num / den) * 100).toFixed(1));