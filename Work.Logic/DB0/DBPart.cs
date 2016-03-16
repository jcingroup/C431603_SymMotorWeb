using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
namespace ProcCore.Business.DB0
{
    public enum EditState
    {
        Insert = 0,
        Update = 1
    }
    public enum VisitDetailState
    {
        none,
        wait,
        progress,
        finish,
        pause
    }
    public enum EditorState
    {
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
    public enum EventType
    {
        OldActivity = 1,//精彩活動回顧
        NewActivity = 2//購車優惠
    }
    public enum LocationType
    {
        is_sales = 1,//展示中心
        is_repair = 2//維修中心
    }
    public enum EmailState
    {
        FAQ = 1,//FAQ 聯絡我們
        TestDrive = 2,//預約試乘
        UsedCar = 3,//認證中古車 協尋找車
        BuyCar = 4,//購車服務 預約賞車
        Loan = 5//貸款專區 線上申貸表格
    }
    #region set CodeSheet

    public static class CodeSheet
    {
        public static List<i_Code> sales_rank = new List<i_Code>()
        {
            new i_Code{ Code = 1, Value = "共享會員", LangCode = "wait" },
            new i_Code{ Code = 2, Value = "經理人", LangCode = "progress" },
            new i_Code{ Code = 3, Value = "營運中心", LangCode = "finish" },
            new i_Code{ Code = 4, Value = "管理處", LangCode = "pause" }
        };

        public static string GetStateVal(int code, List<i_Code> data)
        {
            string Val = string.Empty;
            foreach (var item in data)
            {
                if (item.Code == code)
                    Val = item.Value;
            }
            return Val;
        }
    }
    public class i_Code
    {
        public int? Code { get; set; }
        public string LangCode { get; set; }
        public string Value { get; set; }
    }
    #endregion

    public partial class C34A1_SYM_MotorEntities : DbContext
    {
        public C34A1_SYM_MotorEntities(string connectionstring)
            : base(connectionstring)
        {
        }

        public override Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }
        public override int SaveChanges()
        {
            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                Log.Write(ex.Message, ex.StackTrace);
                foreach (var err_Items in ex.EntityValidationErrors)
                {
                    foreach (var err_Item in err_Items.ValidationErrors)
                    {
                        Log.Write("欄位驗證錯誤", err_Item.PropertyName, err_Item.ErrorMessage);
                    }
                }

                throw ex;
            }
            catch (DbUpdateException ex)
            {
                Log.Write("DbUpdateException", ex.InnerException.Message);
                throw ex;
            }
            catch (EntityException ex)
            {
                Log.Write("EntityException", ex.Message);
                throw ex;
            }
            catch (UpdateException ex)
            {
                Log.Write("UpdateException", ex.Message);
                throw ex;
            }
            catch (Exception ex)
            {
                Log.Write("Exception", ex.Message);
                throw ex;
            }
        }

    }
    #region Model Expand
    public partial class m_News
    {
        public string imgsrc { get; set; }
    }
    public partial class m_Banner
    {
        public string imgsrc { get; set; }
    }
    public partial class m_BrandDetail
    {
        public string imgsrc { get; set; }
    }
    public partial class m_Event
    {
        public string list_imgsrc { get; set; }
        public string banner_imgsrc { get; set; }
    }
    public partial class Event
    {
        public string banner_imgsrc { get; set; }
    }
    public partial class m_Faq
    {
        public string category_name { get; set; }
    }
    public partial class m_EditorDetail
    {
        public EditState edit_state { get; set; }
    }
    public partial class EditorDetail
    {
        public EditState edit_state { get; set; }
    }
    public partial class m_Brand
    {
        public string category_name { get; set; }
        public string imgsrc { get; set; }
    }
    public partial class Brand
    {
        public string category_name { get; set; }
        public string imgsrc { get; set; }
        public List<BrandAlbum> albums { get; set; }
    }
    public partial class BrandAlbum
    {
        public string imgsrc { get; set; }
    }
    public partial class BrandAlbumDetail
    {
        public string imgsrc { get; set; }
    }
    public partial class TestDrive
    {
        public string location_name { get; set; }
        public string location_address { get; set; }
    }
    public class PutPurchaseCheckPram
    {
        public string id { get; set; }
        public int state { get; set; }
        public bool is_mail { get; set; }
    }
    public partial class Menu
    {
        public IList<MenuRoleArray> role_array { get; set; }
    }
    public class MenuRoleArray
    {
        public string role_id { get; set; }
        public bool role_use { get; set; }
        public string role_name { get; set; }
    }
    public class option
    {
        public int val { get; set; }
        public string Lname { get; set; }
    }
    public class GroupOption
    {
        public string key { get; set; }
        public List<option> items { get; set; }
        public List<m_Location> locations { get; set; }
    }
    public class L1
    {
        public int l1_id { get; set; }
        public string l1_name { get; set; }
        public List<L2> l2_list { get; set; }
    }
    public class L2
    {
        public int l2_id { get; set; }
        public string l2_name { get; set; }
    }
    public class Param
    {
        public string Email { get; set; }
        public string FacebookUrl { get; set; }
    }
    #endregion

    #region q_Model_Define
    public class q_AspNetRoles : QueryBase
    {
        public string Name { set; get; }

    }
    public class q_AspNetUsers : QueryBase
    {
        public string UserName { set; get; }

    }
    #endregion

    #region c_Model_Define
    public class c_AspNetRoles
    {
        public q_AspNetRoles q { get; set; }
        public AspNetRoles m { get; set; }
    }
    public partial class c_AspNetUsers
    {
        public q_AspNetUsers q { get; set; }
        public AspNetUsers m { get; set; }
    }
    #endregion
}
