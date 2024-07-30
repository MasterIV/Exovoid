export default function calculatePool(a: number, s: number, p=0) {
    const aptitude = Math.max(a, s);
    const expertise = Math.min(a, s);
    return {default: 1, aptitude: aptitude-expertise, expertise};
}