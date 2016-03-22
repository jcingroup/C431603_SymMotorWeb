using DotWeb.Helpers;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class TestDriveController : ajaxApi<TestDrive, q_TestDrive>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.TestDrive.FindAsync(id);
                item.location_name = item.Location.location_name;
                item.location_address = item.Location.city + item.Location.country + item.Location.address;
                r = new ResultInfo<TestDrive>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_TestDrive q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.TestDrive
                    .OrderByDescending(x => new { x.view_year, x.view_month, x.view_day })
                    .Select(x => new m_TestDrive()
                    {
                        test_drive_id = x.test_drive_id,
                        name = x.name,
                        sex = x.sex,
                        email = x.email,
                        tel = x.tel,
                        view_year = x.view_year,
                        view_month = x.view_month,
                        view_day = x.view_day,
                        view_time = x.view_time,
                        car_models_name = x.car_models_name,
                        view_city = x.view_city
                    });
                if (q.keyword != null)
                {
                    items = items.Where(x => x.name.Contains(q.keyword) || x.email.Contains(q.keyword) || x.tel.Contains(q.keyword));
                }
                if (q.city != null)
                {
                    items = items.Where(x => x.view_city == q.city);
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_TestDrive>()
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]TestDrive md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.TestDrive.FindAsync(md.test_drive_id);

                item.i_Hide = md.i_Hide;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]TestDrive md)
        {
            md.test_drive_id = GetNewId(CodeTable.TestDrive);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<TestDrive>();
            if (!ModelState.IsValid)
            {
                r.message = ModelStateErrorPack();
                r.result = false;
                return Ok(r);
            }

            try
            {
                #region working
                db0 = getDB0();

                db0.TestDrive.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.test_drive_id;
                return Ok(r);
                #endregion
            }
            catch (DbEntityValidationException ex) //欄位驗證錯誤
            {
                r.message = getDbEntityValidationException(ex);
                r.result = false;
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message + "\r\n" + getErrorMessage(ex);
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            try
            {
                db0 = getDB0();
                r = new ResultInfo<TestDrive>();
                foreach (var id in ids)
                {
                    item = new TestDrive() { test_drive_id = id };
                    db0.TestDrive.Attach(item);
                    db0.TestDrive.Remove(item);
                }
                await db0.SaveChangesAsync();

                r.result = true;
                return Ok(r);
            }
            catch (DbUpdateException ex)
            {
                r.result = false;
                if (ex.InnerException != null)
                {
                    r.message = Resources.Res.Log_Err_Delete_DetailExist
                        + "\r\n" + getErrorMessage(ex);
                }
                else
                {
                    r.message = ex.Message;
                }
                return Ok(r);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
                return Ok(r);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
    public class q_TestDrive : QueryBase
    {
        public string keyword { get; set; }
        public string city { get; set; }
    }
}
