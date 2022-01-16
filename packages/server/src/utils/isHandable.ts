const isHandable = (obj: any) => Buffer.isBuffer(obj) || ArrayBuffer.isView(obj)

export default isHandable