export const gpsCode = state => {
    return state.sgps.code || state.gps.code
}
export const gpsName = state => {
    return state.sgps.code ? state.sgps.name : state.gps.name
}
