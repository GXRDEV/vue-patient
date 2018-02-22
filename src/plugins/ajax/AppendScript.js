
export default function (src, resolve) {
    let body = document.getElementsByTagName('body')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.onload = function () {
        resolve()
    }
    body.appendChild(script)
}
