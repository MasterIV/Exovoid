export function parseShipStat(expr: string | number, Max: number, Cap: number = 0) {
    return Math.round(eval(String(expr))*100) / 100;
}


export default function calculateShipStats() {

}