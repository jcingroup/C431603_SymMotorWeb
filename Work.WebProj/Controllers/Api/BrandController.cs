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
    public class BrandController : ajaxApi<Brand, q_Brand>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.Brand.FindAsync(id);
                r = new ResultInfo<Brand>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_Brand q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.Brand
                    .OrderByDescending(x => x.sort)
                    .Select(x => new m_Brand()
                    {
                        brand_id = x.brand_id,
                        brand_category_id = x.brand_category_id,
                        category_name = x.BrandCategory.category_name,
                        brand_name = x.brand_name,
                        sort = x.sort,
                        i_Hide = x.i_Hide
                    });
                if (q.keyword != null)
                {
                    items = items.Where(x => x.brand_name.Contains(q.keyword));
                }
                if (q.category_id != null)
                {
                    items = items.Where(x => x.brand_category_id == q.category_id);
                }
                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());
                var resultItems = await items.Skip(startRecord).Take(this.defPageSize).ToListAsync();

                return Ok(new GridInfo<m_Brand>()
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
        public async Task<IHttpActionResult> Put([FromBody]Brand md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.Brand.FindAsync(md.brand_id);

                item.brand_name = md.brand_name;
                item.brand_category_id = md.brand_category_id;
                item.price = md.price;//價格
                item.colors = md.colors;//車色
                item.seat = md.seat;//乘客數
                item.engine_displacement = md.engine_displacement;//排氣量
                item.gearshift = md.gearshift;//排檔方式
                item.feature = md.feature;//特色
                item.specification = md.specification;//規格
                item.news = md.news;//報導
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
        public async Task<IHttpActionResult> Post([FromBody]Brand md)
        {
            md.brand_id = GetNewId(CodeTable.Brand);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<Brand>();
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

                db0.Brand.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.brand_id;
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
                r = new ResultInfo<Brand>();
                foreach (var id in ids)
                {
                    var get_a = db0.BrandAlbum.Where(x => x.brand_id == id).ToList();
                    foreach (var i in get_a)
                    {
                        db0.BrandAlbumDetail.RemoveRange(i.BrandAlbumDetail);
                    }
                    db0.BrandAlbum.RemoveRange(get_a);
                    item = new Brand() { brand_id = id };
                    db0.Brand.Attach(item);
                    db0.Brand.Remove(item);
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
    public class q_Brand : QueryBase
    {
        public string keyword { get; set; }
        public int? category_id { get; set; }
    }
}
