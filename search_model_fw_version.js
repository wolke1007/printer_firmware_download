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
//        console.log('item model already in model_version_url')  // debug
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
var data_body = document.getElementById("data_body")
var filtered_company_model
var filtered_model_version
var filtered_version

function fill_info_into_table(filtered_info){
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

// 選擇公司要做的事
company_select.addEventListener('change', (event) => {
  // 先過濾公司名字
  console.log(company_select.value);
  filtered_company_model = company_model.filter(item => {
    return company_select.value == item.company;
  });

  fill_info_into_table(filtered_company_model);

  // 將機型選項更新
  model_select.innerHTML = ''
  let union = []
  filtered_company_model.forEach(printer => {
      union.push(printer.model)
  })
  union_model = new Set(union)

  union_model.forEach(name =>{
      model_option = document.createElement("option")
      model_option.text = name
      model_select.appendChild(model_option)
  })

  // 只顯示當前機型內容
  filtered_model_version = filtered_company_model.filter(item => {
    return model_select.value == item.model;
  });

  fill_info_into_table(filtered_model_version);
});


// 選擇機型要做的事
model_select.addEventListener('change', (event) => {

  filtered_model_version = filtered_company_model.filter(item => {
    return model_select.value == item.model;
  });

  fill_info_into_table(filtered_model_version);

  // 將版本選項更新
  version_select.innerHTML = ''
  let union = []
  filtered_model_version.forEach(printer => {
      union.push(printer.version)
  })
  union_model = new Set(union)

  union_model.forEach(name =>{
      version_option = document.createElement("option")
      version_option.text = name
      version_select.appendChild(version_option)
  })

});

// 選擇版本要做的事
version_select.addEventListener('change', (event) => {
  console.log(version_select.value)
    filtered_version = filtered_model_version.filter(item => {
    return version_select.value == item.version;
  });

  fill_info_into_table(filtered_version);

});


// 製作選項
let union = []
company_model.forEach(printer => {
    union.push(printer.company)
})
union_company = new Set(union)

union_company.forEach(name =>{
    company_option = document.createElement("option")
    company_option.text = name
    company_select.appendChild(company_option)
})

/*!
 * iOS doesn't respect the meta viewport tag inside a frame
 * add a link to the debug view (for demo purposes only)
 */
if (/(iPhone|iPad|iPod)/gi.test(navigator.userAgent) && window.location.pathname.indexOf('/full') > -1) {
  var p = document.createElement('p');
  p.innerHTML = '<a target="_blank" href="https://s.codepen.io/dbushell/debug/wGaamR"><b>Click here to view this demo properly on iOS devices (remove the top frame)</b></a>';
  document.body.insertBefore(p, document.body.querySelector('h1'));
}