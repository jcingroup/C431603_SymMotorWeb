//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProcCore.Business.DB0
{
    using System;
    using System.Collections.Generic;
    
    using Newtonsoft.Json;
    public partial class Location : BaseEntityTable
    {
        public int location_id { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string location_name { get; set; }
        public string address { get; set; }
        public string tel { get; set; }
        public bool is_sales { get; set; }
        public bool is_repair { get; set; }
        public bool engine { get; set; }
        public bool spray_sheet { get; set; }
        public bool night { get; set; }
        public bool holiday { get; set; }
        public bool fast_insurance { get; set; }
        public double north_coordinate { get; set; }
        public double east_coordinate { get; set; }
        public int sort { get; set; }
        public bool i_Hide { get; set; }
        public string i_InsertUserID { get; set; }
        public Nullable<int> i_InsertDeptID { get; set; }
        public Nullable<System.DateTime> i_InsertDateTime { get; set; }
        public string i_UpdateUserID { get; set; }
        public Nullable<int> i_UpdateDeptID { get; set; }
        public Nullable<System.DateTime> i_UpdateDateTime { get; set; }
        public string i_Lang { get; set; }
    }
}
