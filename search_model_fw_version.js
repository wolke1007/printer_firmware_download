var company_model = [
    {
        "company": "A",
        "model": "M100",
        "version": "1.0.0"
    },
    {
        "company": "A",
        "model": "M100",
        "version": "1.0.1"
    },
    {
        "company": "A",
        "model": "M200",
        "version": "1.1.0"
    },
    {
        "company": "B",
        "model": "M100",
        "version": "1.1.0"
    },
    {
        "company": "B",
        "model": "M200",
        "version": "1.1.1"
    },
    {
        "company": "B",
        "model": "M200",
        "version": "1.2.1"
    }
]

var raw_model_version_url = [
    {
        "model": "M100",
        "version": "1.0.0",
        "url": "http://www.google.com"
    },
    {
        "model": "M100",
        "version": "1.0.1",
        "url": "bbb"
    },
    {
        "model": "M200",
        "version": "1.0.0",
        "url": "ccc"
    }
]

var model_version_url = {}
raw_model_version_url.forEach(item => {
    if (item.model in model_version_url){
        model_version_url[item.model].push({'version': item.version, 'url': item.url})
    } else {
        model_version_url[item.model] = [{'version': item.version, 'url': item.url}]
    }
})

// 將 raw_model_version_url 改成以下格式
//{
//  M100: [
//    { version: '1.0.0', url: 'aaa' },
//    { version: '1.0.1', url: 'bbb' }
//  ],
//  M200: [ { version: '1.0.0', url: 'ccc' } ]
//}


// 將 url 更新至 company_model中
company_model.forEach(company_printer => {
    let info = model_version_url[company_printer.model].filter(item => item.version == company_printer.version)[0]
    if (info != undefined) {
        company_printer.url = info.url
    }
});

var company_select = document.getElementById("company_select")
var model_select = document.getElementById("model_select")
var version_select = document.getElementById("version_select")
var filtered_data

function fill_info_into_table(filtered_info){
    let data_body = document.getElementById("data_body")
    data_body.innerHTML = ''
    filtered_info.forEach(printer => {
        let tr = document.createElement("tr")
        data_body.appendChild(tr)

        let company = document.createElement("td")
        let model = document.createElement("td")
        let version = document.createElement("td")
        let url_cell = document.createElement("td")
        let url = document.createElement("a")

        company.appendChild(document.createTextNode(printer.company));
        model.appendChild(document.createTextNode(printer.model));
        version.appendChild(document.createTextNode(printer.version));
        if (printer.url != undefined) {
            url.text = printer.url
            url.href = printer.url
        } else {
            url.text = 'no url'
        }
        tr.appendChild(company);
        tr.appendChild(model);
        tr.appendChild(version);
        url_cell.appendChild(url);
        tr.appendChild(url_cell);
    })
}

function fill_into_option(select_element, union_data){
    union_data.forEach(name =>{
        option_element = document.createElement("option")
        option_element.text = name
        select_element.appendChild(option_element)
    });
}

function get_union_data_by(filtered_data, data_type){
    let union_data = new Set()
    filtered_data.forEach(printer => {
        switch(data_type) {
            case 'company':
                union_data.add(printer.company)
                break;
            case 'model':
                union_data.add(printer.model)
                break;
            case 'version':
                union_data.add(printer.version)
                break;
        }
    })
    return union_data
}


// 選擇公司要做的事
company_select.addEventListener('change', (event) => {
    // 依選擇的公司名字過濾公司
    filtered_data = company_model.filter(item => {
        return company_select.value == item.company;
    });

    fill_info_into_table(filtered_data);

    // 將版本選項清空
    version_select.innerHTML = ''

    // 將機型選項清空
    model_select.innerHTML = ''

    // 取得去重複的機型
    let union_model = get_union_data_by(filtered_data, 'model')

    // 更新「機型」選項
    fill_into_option(model_select, union_model)

    // 選出當前機型內容
    let filtered_model_version = filtered_data.filter(item => {
        return model_select.value == item.model;
    });

    // 依照目前選出來的機型下去搜出去重複的版本
    let union_version_by_model = get_union_data_by(filtered_model_version, 'version')
    
    // 更新「版本」選項
    fill_into_option(version_select, union_version_by_model)

    // table 填入機型
    fill_info_into_table(filtered_model_version);
});


// 選擇機型要做的事
model_select.addEventListener('change', (event) => {
    // 依公司名字過濾機型
    filter_model_by_selected_company = filtered_data.filter(item => {
        return model_select.value == item.model;
    });

    // table 填入機型
    fill_info_into_table(filter_model_by_selected_company);

    // 將版本選項清空
    version_select.innerHTML = ''
    
    // 依照目前選出來的機型下去搜出去重複的版本
    let union_version = get_union_data_by(filter_model_by_selected_company, 'version')

    // 更新「版本」選項
    fill_into_option(version_select, union_version)

});


// 選擇版本要做的事
version_select.addEventListener('change', (event) => {
    let filtered_version = filtered_data.filter(item => {
        return model_select.value == item.model && version_select.value == item.version;
    });

    fill_info_into_table(filtered_version);

});


// 製作「公司」選項
let union_company = get_union_data_by(company_model, 'company')

// 更新「公司」選項
fill_into_option(company_select, union_company)

/*!
 * iOS doesn't respect the meta viewport tag inside a frame
 * add a link to the debug view (for demo purposes only)
 */
if (/(iPhone|iPad|iPod)/gi.test(navigator.userAgent) && window.location.pathname.indexOf('/full') > -1) {
    var p = document.createElement('p');
    p.innerHTML = '<a target="_blank" href="https://s.codepen.io/dbushell/debug/wGaamR"><b>Click here to view this demo properly on iOS devices (remove the top frame)</b></a>';
    document.body.insertBefore(p, document.body.querySelector('h1'));
}