import * as turf from '@turf/turf'

const SAMPLING_RATE = 1 // KM

const MAX_ELEVATION_ANGLE = turf.degreesToRadians(5)

const calculateProjectionFromOrigin = (origin, destination, sensor) => {
  const groundDistance = turf.distance(turf.getCoord(origin), turf.getCoord(destination))
  const altitude = sensor.altidude / 1000

  const currentElevationAngle = Math.tanh(altitude / groundDistance)

  const bottomElevationAngle = currentElevationAngle + turf.degreesToRadians(sensor.coneAngle)
  const topElevationAngle = Math.max(currentElevationAngle - turf.degreesToRadians(sensor.coneAngle), MAX_ELEVATION_ANGLE)

  const bottomProjectionGroundDistance = altitude / Math.tan(bottomElevationAngle)
  const topProjectionGroundDistance = altitude / Math.tan(topElevationAngle)

  const bearing = turf.bearing(turf.getCoord(origin), turf.getCoord(destination))

  const bottomProjectionPoint = turf.destination(origin, bottomProjectionGroundDistance, bearing)
  const topProjectionPoint = turf.destination(origin, topProjectionGroundDistance, bearing)

  return turf.lineString([turf.getCoord(bottomProjectionPoint), turf.getCoord(topProjectionPoint)])
}

const calculateFullProjectionFromOrigin = (origin, destination, sensor) => {
  const leftDestination = turf.transformRotate(turf.lineString([turf.getCoord(origin), turf.getCoord(destination)]), -sensor.coneAngle, { pivot: turf.getCoord(origin) })
  const rightDestination = turf.transformRotate(turf.lineString([turf.getCoord(origin), turf.getCoord(destination)]), sensor.coneAngle, { pivot: turf.getCoord(origin) })

  const leftProjectedLine = calculateProjectionFromOrigin(origin, turf.getCoords(leftDestination)[1], sensor)
  const rightProjectedLine = calculateProjectionFromOrigin(origin, turf.getCoords(rightDestination)[1], sensor)

  return turf.lineToPolygon(turf.lineString([...turf.getCoords(leftProjectedLine), ...turf.getCoords(rightProjectedLine).reverse()]))
}

const calculatePossibleAccesses = (lane, sensor, requirements) => {
  let accesses = []
  let sampleDistance = 0
  let sampleOrigin = turf.along(lane, sampleDistance)

  const sampleDestination = turf.centerOfMass(requirements.target)

  while (turf.distance(turf.getCoord(sampleOrigin), turf.getCoord(turf.explode(lane).features.at(-1)))) {
    const projectionPolygon = calculateFullProjectionFromOrigin(sampleOrigin, sampleDestination, sensor)
    accesses.push(projectionPolygon)

    sampleDistance += SAMPLING_RATE
    sampleOrigin = turf.along(lane, sampleDistance)
  }

  return accesses
}
export default calculatePossibleAccesses