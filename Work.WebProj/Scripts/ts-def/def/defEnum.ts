const enum EditState {
    Insert = 0,
    Update = 1
}

const enum EditorState {
    AboutUs = 1,//公司介紹
    Enterprise = 2, //企業相關網站
    Careers = 3, //菁英招募
    BuyCar = 4, //購車服務
    Repair = 5, //維修服務
    Loan = 6, //貸款專區
    Insurance = 7, //保險專區
    Accessory = 8, //配件專區
    Eco = 9 //綠能專區
}
const enum EmailState {
    FAQ = 1,//FAQ 聯絡我們
    TestDrive = 2,//預約試乘
    UsedCar = 3,//認證中古車 協尋找車
    BuyCar = 4,//購車服務 預約賞車
    Loan = 5//貸款專區 線上申貸表格
}
const enum EventType {
    OldActivity = 1,//精彩活動回顧
    NewActivity = 2//購車優惠
}