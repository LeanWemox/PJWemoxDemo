/**
 * Reproduces the Power Fx hito offset calculation.
 *
 * Power Fx extracts eight characters starting at position 12 (1-based).
 */
export function getHitoStartTime(
  titulo: string,
  inicioVideoSegundos: number,
): number {
  if (!Number.isFinite(inicioVideoSegundos)) {
    throw new RangeError('inicioVideoSegundos must be a finite number')
  }

  const exactTimestamp = titulo.slice(11, 19)
  const shiftedTimestamp = titulo.slice(12, 20)
  const match =
    /^(\d{2}):([0-5]\d):([0-5]\d)$/.exec(exactTimestamp) ??
    /^(\d{2}):([0-5]\d):([0-5]\d)$/.exec(shiftedTimestamp)

  if (match === null) {
    throw new Error(
      'titulo must contain a valid hh:mm:ss timestamp at characters 12-19',
    )
  }

  const [, hours, minutes, seconds] = match

  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) -
    inicioVideoSegundos
  )
}
