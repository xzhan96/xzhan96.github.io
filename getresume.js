// cache进行缓存，目前已有的候选人列表
let cache = new Set()

// 每次发消息的内容
let msg = []

let targetCandidate = []

function getHttpHeader(pageNum) {
    let options = {
        method: 'POST',//post请求
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({//post请求参数
            channel: [],
            education: ["2", "3"],
            flow_status: ["0", "8"],
            graduate_time: 2022,
            id: "",
            idcard: "",
            idepts: [],
            isUnRead: 0,
            is_deploy: null,
            is_full: 0,
            is_mine: 0,
            keyword: "",
            last_update: "",
            // 每次请求获取的候选人数量
            limit: 20,
            mobile: "",
            name: "",
            orderBy: "update_time",
            // 第几页
            page: pageNum,
            qq: "",
            rank: [],
            recruit_city: [],
            recruit_project: [],
            school: "",
            score_type: "",
            speciality: "",
            station: ["103", "102"],
            tag_id: [],
            work_city: ["3"],
        })
    }
    return options
}

function search(options) {
    return new Promise((resolve, reject) => {
        fetch('http://campus.oa.com/campusCenterApi/v1/resume/search', options).then((res) => {
            if(res.ok){//如果取数据成功
                res.json().then((data) => {
                    let list = data.data.list
                    let total = data.data.total
                    for(let i =0; i<list.length; i++) {
                        if(!cache.has(list[i].id)){
                            cache.add(list[i].id)
                            msg.push({
                                id: list[i].id,
                                url: `http://campus.oa.com/#/resumeview?rid=${list[i].rid}`
                            })
                        }
                        // 满足执行条件
                        // if(targetCandidate.indexOf(list[i].id) > -1) {
                        //     window.open(`http://campus.oa.com/#/resumeview?rid=${list[i].rid}`, "_blank");
                        // }
                    }
                    resolve(total)
                })
            }
        })
    })
}

function searchAllPages() {
    search(getHttpHeader(1)).then((total) => {
        for(let i = 2; i < Math.ceil(total/20)+1; ++i){
            search(getHttpHeader(i))
        }
    })

}

function randomNum(minNum, maxNum){
    return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);

}

// 第一次执行, 更新一下cache
// searchAllPages()
// msg = []
// 间隔时间执行
function cycleSearch() {
    let time = new Date()
    if(time.getHours() > 0 && time.getHours() < 9) {
        return
    }
    setTimeout(() => {
        searchAllPages()
    }, randomNum(1,5)*1000*60)
}
setInterval(cycleSearch, 30*60*1000)

setInterval(() => {
    console.log(new Date(), '简历来啦', msg)
    if (msg) alert('简历来啦：' + msg)
    msg = []
}, 20*60*1000)