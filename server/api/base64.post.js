import encoder from "ab2b64"

export default defineEventHandler(async (event) => {
  const params = await readBody(event)
  let bases = []
  for (const item of params.key) {
    const file = await fetch(item).then(data => data.blob())
    const buffer = await file.arrayBuffer()
    const base = await encoder.ab2b64Async(buffer)
    console.log('here')
    bases.push(base)
  }

  return bases
})