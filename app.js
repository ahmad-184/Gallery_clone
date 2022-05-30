const headerBaner = document.querySelector('header')
const container = document.querySelector('#container')
const form = document.querySelector('form')
const input = form.querySelector('input')
const section = document.querySelector('.mainSec')
const sectionSugg = document.querySelector('.suggSection')
const button = document.querySelector('.searchBtn')
const changeImgSubject = document.querySelectorAll('#btnn')
const changeImgVideoSub = document.querySelectorAll('.btnTab')
const imageActive = document.querySelector('.imageBtn')
const videoActive = document.querySelector('.videoBtn')
const active_tab = document.querySelector('.active-tab')
const clear = document.querySelector('.clearSearch')
const loaderIcon = document.querySelector('.pagecontroler')
const nextBtnCont = document.querySelector('.nextPageButton')
const textContentDetail = document.querySelector('.text-Detail')
const downloadListButton = document.querySelectorAll('#toggleDLlist')
const downloadList = document.querySelector('.listUrl')
const toTopBtn = document.querySelector('.backTotop')
let pageIndex
let searchValue
let callCalss

document.addEventListener('DOMContentLoaded', () => {
    loadBtnSize()
    callCalss = new gallery(container)
    textContentDetail.innerHTML = 'Free Stock Photos'
    container.classList.add('container')
})

window.addEventListener('resize', () => {
    loadBtnSize()
})

downloadListButton.forEach(btn => {
    btn.addEventListener('click',e => {
        e.stopPropagation()
        btn.nextElementSibling.toggleAttribute('data-List')
    })
})

for (const btn  of changeImgSubject) {
    btn.addEventListener('click', () => {
        for (const t of changeImgSubject) {
            t.removeAttribute('data-active-sub')
        }
    })
    btn.addEventListener('click', () => {
        trendOrNew.innerHTML = btn.innerHTML
        const sub = btn.getAttribute('data-subject')
        btn.setAttribute('data-active-sub','')
    })
}

const active = (x,y) => {
    active_tab.style.width = x + 'px'
    active_tab.style.left = y + 'px'
}

const loadBtnSize = () => {
    changeImgVideoSub.forEach(btn => {
        if (btn.hasAttribute('data-blue')) {
            let width = btn.offsetWidth
            let postionX = btn.offsetLeft
            active(width,postionX)
        }
    })
}

for (const btn of changeImgVideoSub) {
    btn.addEventListener('click',(e) => {
        for (const btn2 of changeImgVideoSub) {
            btn2.removeAttribute('data-blue')
        }
        let width = e.target.offsetWidth
        let postionX = e.target.offsetLeft
        active(width,postionX)
        btn.setAttribute('data-blue','')
    })
}

nextBtnCont.querySelector('#more').addEventListener('click', e => {
    callCalss.nextPage(e.target.getAttribute('data-url'))
})

imageActive.addEventListener('click',(e) => {
    containerGrid(e)
    container.innerHTML= ''
    input.setAttribute('placeholder','Search Image...')
    textContentDetail.innerHTML = 'Free Stock Photos'
    callCalss.getApiUrl(1)
})

videoActive.addEventListener('click',(e) => {
    containerGrid(e)
    container.innerHTML= ''
    textContentDetail.innerHTML = 'trending free Stock videos'
    input.setAttribute('placeholder','Search Video...')
    callCalss.videos()
})

const containerGrid = e => {
    if (e.target.className.includes('videoBtn')) {
        container.classList.remove('container')
        container.classList.add('container2')
    } else{
        container.classList.add('container')
        container.classList.remove('container2')
    }
}

'------------------------------------- gallery class -------------------------------------------'

const background = document.querySelectorAll('.bg')
const imgSlide = document.querySelector('.slideShowImg')
const videoSlide = document.querySelector('.slideShowVideo')
const closeBtn = document.querySelectorAll('#closeSlide')
const imgLarg = document.querySelector('#largeImg')
const videoLarge = document.querySelector('#video')
const mainLink = document.querySelectorAll('#mainLink')
const orginal = document.querySelectorAll('#orginal')
const medium = document.querySelectorAll('#medium')
const small = document.querySelectorAll('#small')
const landscape = document.querySelector('#landscape')
const portrait = document.querySelector('#portrait')
const videoTag = document.querySelector('#videotag')
const palyIcon = document.querySelector('.palyIcon')

videoTag.addEventListener('click', e => {
    videoTag.paused ? videoTag.play() : videoTag.pause()
    palyIcon.toggleAttribute('data-play')
})

const close = () => {
    videoSlide.style.display = 'none'
    if (!videoTag.paused) {
        videoTag.pause()
    }
    if(palyIcon.hasAttribute('data-play')) { palyIcon.toggleAttribute('data-play') }
}

class gallery {
    constructor(container) {
        this.container = container
        this.key = '563492ad6f917000010000011c4c41ee66e24a49a8ea783530638254'
        this.headerImg()
        pageIndex = 1
        this.getApiUrl()
    }

    getApiUrl() {
        let apiUrl = `https://api.pexels.com/v1/curated?&page=${pageIndex}&per_page=20`
        this.getImgData(apiUrl)
    }

    async getImgData(url) {
        nextBtnCont.style.display = 'none'
        loaderIcon.classList.add('visible')
        const fetchData = await fetch(url,{
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: '563492ad6f917000010000011c4c41ee66e24a49a8ea783530638254'
            }
        }).then(data => data.json())
        .catch(err => {
            console.log(err);
            if (err) { this.showProblem() }
            return
        })
        this.checkData(fetchData)
    }

    async checkData(data) {
        const object = await data
        console.log(object)
        if(object.photos == 0 || object.videos == 0 || data.status == 400) {
            this.container.innerHTML = ''
            loaderIcon.classList.remove('visible')
            let span = document.createElement('span')
            span.className = 'notFound'
            span.innerHTML = 'not found 😥'
            this.container.appendChild(span)
            return
        }
        if (object) {
            loaderIcon.classList.remove('visible')
            nextBtnCont.style.display = 'flex'
        }
        if (nextBtnCont.querySelector('#more').hasAttribute('data-data-url')) { nextBtnCont.querySelector('#nextPage').removeAttribute('data-url') }
        nextBtnCont.querySelector('#more').setAttribute('data-url',object.next_page)
        if (object.photos) { this.buildHtmlImage(object) }
        if (object.videos) { this.buildHtmlVideos(object) }
    }

    showProblem() {
        loaderIcon.classList.remove('visible')
        let span = document.createElement('span')
        span.className = (imageActive.hasAttribute('data-blue')) ? 'arror2' : 'arror'
        span.innerHTML = 'Opppss ,somthing wrong 😢'
        this.container.appendChild(span)
    }

    async buildHtmlImage(data) {
        const object = await data
        for (const box of object.photos) {
            const div = document.createElement('div')
            div.className = 'img-box'
            const html = `
                <img class="img" src="${box.src.large2x}">
                <span class="title_img">${box.photographer}</span>
            `
            div.innerHTML = html
            div.setAttribute('title', box.alt)
            this.container.appendChild(div)

            div.addEventListener('click',() => {
                background[0].addEventListener('click',() => { document.querySelector('.slideShowImg').style.display = 'none' })
                imgSlide.style.display = 'flex'
                closeBtn[0].addEventListener('click',() => { document.querySelector('.slideShowImg').style.display = 'none' })
                imgLarg.src = box.src.large2x
                mainLink[0].href = box.src.large
                orginal[0].href = box.src.original
                medium[0].href = box.src.medium
                small[0].href = box.src.small
                landscape.href = box.src.landscape
                portrait.href = box.src.portrait
            })
        }
    }

    async buildHtmlVideos(data) {
        const object = await data
        for (const box of object.videos) {
            const div = document.createElement('div')
            div.className = 'img-box'
            const html = `
                <img class="img" src="${box.image}">
                <span class="title_img">${box.user.name}</span>
                <span class="play" ><i class="fas fa-play-circle"></i></span>
            `
            div.innerHTML = html
            this.container.appendChild(div)
            div.addEventListener('click',() => {
                background[1].addEventListener('click',() => close() )
                videoSlide.style.display = 'flex'
                closeBtn[1].addEventListener('click',() => close() )
                videoTag.setAttribute('poster',box.image)
                videoTag.src = box.video_files[1].link
                mainLink[1].href = box.video_files[2].link
                orginal[1].href = box.video_files[0].link
                medium[1].href = box.video_files[2].link
                small[1].href = box.video_files[3].link
            })
        }
    }

    nextPage(url) {
        if(searchValue == null || searchValue == '') { this.getImgData(url) }
        else{ this.getImgData(url) }
    }

    searchImg(value = null) {
        searchValue = input.value
        pageIndex = 1
        this.getSearchImg(value)
    }

    searchVideo(value = null) {
        searchValue = input.value
        pageIndex = 1
        this.getSearchVideo(value)
    }

    getSearchImg(value = null) {
        // container = ''
        const url = `https://api.pexels.com/v1/search?query=${value != null ? value : searchValue}&page=${pageIndex}&per_page=20`
        this.getImgData(url)
    }

    getSearchVideo(value = null) {
        // this.container = ''
        const url = `https://api.pexels.com/videos/search?query=${value != null ? value : searchValue}&page=${pageIndex}&per_page=15`
        this.getImgData(url)
    }

    videos() {
        const url = `https://api.pexels.com/videos/popular?&page=${pageIndex}&per_page=15`
        this.getImgData(url)
        input.value = ''
    }

    async headerImg() {
        let Suggestions = ['nature','developer','ocean','mountain','forest'
        ,'snow','car','progremmer','countries','colors','road','woods']
        let randomSugg = Math.floor(Math.random() * 12)
        let randomPage = Math.floor(Math.random() * 5)
        console.log(randomPage)
        const fetchData = await fetch(`https://api.pexels.com/v1/search?&query=${Suggestions[randomSugg]}&per_page=5`,{
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: '563492ad6f917000010000011c4c41ee66e24a49a8ea783530638254'
            }
        }).then(data => data.json())
        console.log(fetchData);
        headerBaner.style.backgroundImage = `url(${fetchData.photos[randomPage].src.landscape})`
    }
}

"----------------- save search value --------------------"

const historyContainer = document.querySelector('.searchesContent')

const saveValue = () => {
    localforage.length().then(num => {
        let strand = `search${num}`
        localforage.setItem(strand,input.value).then( message => {
            buildHistoryHtml()
            input.value = ''
        })
    })
}

const buildHistoryHtml = () => {
    historyContainer.innerHTML = ''
    localforage.iterate( (value,key,iteratNum) => {
        const span = document.createElement('span')
        span.innerHTML = `${value} <span><svg fill="gray" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="18px" height="18px"><path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"/></svg></span>`
        span.setAttribute('data-value',value)

        span.addEventListener('click', () => {
            container.innerHTML= ''
            
            imageActive.hasAttribute('data-blue') ? callCalss.searchImg(value) : callCalss.searchVideo(value)
        })
        historyContainer.appendChild(span)
        section.removeAttribute('data-form-active')
    })
}

section.addEventListener('click', e => {
    e.stopPropagation()
    localforage.length().then(item => {
        if (item > 0) { section.setAttribute('data-form-active','') }
    })
})

clear.addEventListener('click',() => {
    localforage.clear()
    section.removeAttribute('data-form-active')
})

form.addEventListener('submit', e => {
    e.preventDefault()
    if (input.value == '') { return }
    section.removeAttribute('data-form-active')
    container.innerHTML = ''
    if (imageActive.hasAttribute('data-blue')) {
        textContentDetail.innerHTML = `${input.value} photos`
        callCalss.searchImg()
    }
    if (videoActive.hasAttribute('data-blue')) {
        textContentDetail.innerHTML = `${input.value} videos`
        callCalss.searchVideo()
    }
    saveValue()
})

document.addEventListener('DOMContentLoaded', e => { buildHistoryHtml() })

document.querySelector('body').addEventListener('click', () => {
    downloadListButton.forEach((item) => { 
        if (item.nextElementSibling.hasAttribute('data-List')) { item.nextElementSibling.removeAttribute('data-List') } 
    })
    if (section.hasAttribute('data-form-active')) { section.removeAttribute('data-form-active') }
})

window.addEventListener('scroll', () => { toTopBtn.classList.toggle('active-ToTop', window.scrollY > 500) })
toTopBtn.addEventListener('click', () => window.scrollTo(0,0))
