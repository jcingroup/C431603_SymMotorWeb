﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class C34A1_SYM_MotorEntities : DbContext
    {
        public C34A1_SYM_MotorEntities()
            : base("name=C34A1_SYM_MotorEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Banner> Banner { get; set; }
        public virtual DbSet<Department> Department { get; set; }
        public virtual DbSet<i_Currency> i_Currency { get; set; }
        public virtual DbSet<i_IDX> i_IDX { get; set; }
        public virtual DbSet<i_Lang> i_Lang { get; set; }
        public virtual DbSet<i_Parm> i_Parm { get; set; }
        public virtual DbSet<i_SN> i_SN { get; set; }
        public virtual DbSet<i_UserLoginLog> i_UserLoginLog { get; set; }
        public virtual DbSet<Menu> Menu { get; set; }
        public virtual DbSet<News> News { get; set; }
    }
}