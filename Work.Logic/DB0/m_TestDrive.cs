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
    public partial class m_TestDrive :BaseEntityTable {
    public int test_drive_id { get; set; }
    public string name { get; set; }
    public bool sex { get; set; }
    public string email { get; set; }
    public string tel { get; set; }
    public int car_models { get; set; }
    public string car_models_name { get; set; }
    public string contact_time { get; set; }
    public int view_year { get; set; }
    public int view_month { get; set; }
    public int view_day { get; set; }
    public string view_time { get; set; }
    public string view_city { get; set; }
    public int view_location { get; set; }
    public bool is_edm { get; set; }
    public bool is_agree { get; set; }
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

