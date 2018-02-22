export default {
    mounted () {
        let ele = document.getElementById('chooseitemspage')
        ele && ele.addEventListener('touchmove', function (event) {
            event.target.id == 'chooseitemspage' && event.preventDefault()
        })
        Array.from(document.getElementsByClassName('scroll')).forEach(element => {
            element && element.addEventListener('touchmove', function (event) {
                if (this.clientHeight >= this.scrollHeight) event.preventDefault()
            })
        })
    },
    destroyed () {
        let ele = document.getElementById('chooseitemspage')
        ele && ele.removeEventListener('touchmove', function (event) {
            event.target.id == 'chooseitemspage' && event.preventDefault()
        })
        Array.from(document.getElementsByClassName('scroll')).forEach(element => {
            element && element.removeEventListener('touchmove', function (event) {
                if (this.clientHeight >= this.scrollHeight) event.preventDefault()
            })
        })
    }
}
