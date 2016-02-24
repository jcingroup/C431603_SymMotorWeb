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
    public class EditorDetailController : ajaxApi<EditorDetail, q_EditorDetail>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.EditorDetail.FindAsync(id);
                r = new ResultInfo<EditorDetail>() { data = item };
            }

            return Ok(r);
        }
        public async Task<IHttpActionResult> Get([FromUri]q_EditorDetail q)
        {
            #region working

            using (db0 = getDB0())
            {
                var items = db0.EditorDetail
                    .Where(x => x.editor_id == q.main_id)
                    .OrderByDescending(x => new { main_sort = x.Editor.sort, x.sort })
                    .Select(x => new m_EditorDetail()
                    {
                        editor_id = x.editor_id,
                        editor_detail_id = x.editor_detail_id,
                        detail_name = x.detail_name,
                        detail_content = x.detail_content,
                        sort = x.sort,
                        i_Hide = x.i_Hide,
                        edit_state = EditState.Update
                    });

                return Ok(items.ToList());
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]EditorDetail md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.EditorDetail.FindAsync(md.editor_detail_id);

                item.detail_name = md.detail_name;
                item.editor_id = md.editor_id;
                item.detail_content = md.detail_content;
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
        public async Task<IHttpActionResult> Post([FromBody]EditorDetail md)
        {
            md.editor_detail_id = GetNewId(CodeTable.EditorDetail);

            md.i_InsertDateTime = DateTime.Now;
            md.i_InsertDeptID = this.departmentId;
            md.i_InsertUserID = this.UserId;
            md.i_Lang = "zh-TW";
            r = new ResultInfo<EditorDetail>();
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

                db0.EditorDetail.Add(md);
                await db0.SaveChangesAsync();

                r.result = true;
                r.id = md.editor_detail_id;
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
                r = new ResultInfo<EditorDetail>();
                foreach (var id in ids)
                {
                    item = new EditorDetail() { editor_detail_id = id };
                    db0.EditorDetail.Attach(item);
                    db0.EditorDetail.Remove(item);
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
    public class q_EditorDetail : QueryBase
    {
        public int? main_id { get; set; }
    }
}
