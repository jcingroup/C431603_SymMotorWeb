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
    public class LocationController : ajaxApi<Location, q_Location>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.Location.FindAsync(id);
                r = new ResultInfo<Location>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Location q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Location
                    .OrderByDescending(x => new { x.sort, x.location_id })
                    .Select(x => new m_Location()
                    {
                        location_id = x.location_id,
                        area = x.area,
                        city = x.city,
                        country = x.country,
                        address = x.address,
                        location_name = x.location_name,
                        is_sales = x.is_sales,
                        is_repair = x.is_repair,
                        sort = x.sort,
                        i_Hide = x.i_Hide
                    });
                if (q.keyword != null)
                {
                    items = items.Where(x => x.location_name.Contains(q.keyword) || x.address.Contains(q.keyword) ||
                                             x.area.Contains(q.keyword) || x.city.Contains(q.keyword) || x.country.Contains(q.keyword));
                }
                if (q.area != null)
                {
                    items = items.Where(x => x.area == q.area);
                }
                if (q.type != null)
                {
                    if (q.type == (int)LocationType.is_sales)
                    {
                        items = items.Where(x => x.is_sales == true);
                    }
                    else if (q.type == (int)LocationType.is_repair)
                    {
                        items = items.Where(x => x.is_repair == true);
                    }
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_Location>()
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
        public async Task<IHttpActionResult> Put([FromBody]Location md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.Location.FindAsync(md.location_id);


                item.zip = md.zip;//郵遞區號
                item.city = md.city;//縣市
                item.country = md.country;//區域
                item.address = md.address;//地址
                item.location_name = md.location_name;//據點名稱
                item.tel = md.tel;//電話
                item.is_repair = md.is_repair;//維修據點
                item.is_sales = md.is_sales;//營業所

                item.area = md.area;//區域
                item.business_hours = md.business_hours;//營業時間

                item.north_coordinate = md.north_coordinate;//北座標
                item.east_coordinate = md.east_coordinate;//東座標

                item.sort = md.sort;
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
        public async Task<IHttpActionResult> Post([FromBody]Location md)
        {
            md.location_id = GetNewId(CodeTable.Location);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Location>();
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

                db0.Location.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.location_id;
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
                r = new ResultInfo<Location>();
                foreach (var id in ids)
                {
                    item = new Location() { location_id = id };
                    db0.Location.Attach(item);
                    db0.Location.Remove(item);
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
    public class q_Location : QueryBase
    {
        public string keyword { get; set; }
        public string area { get; set; }
        public int? type { get; set; }
    }
}
