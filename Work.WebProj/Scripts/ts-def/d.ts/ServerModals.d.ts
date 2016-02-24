﻿declare module server {
    interface BaseEntityTable {
        edit_type?: number;
        check_del?: boolean;
        expland_sub?: boolean;
    }
    interface i_Code {
        code: string;
        langCode: string;
        value: string;
    }
    interface CUYUnit {
        sign: string;
        code: string;
    }
    interface i_Lang extends BaseEntityTable {
        lang: string;
        area: string;
        memo: string;
        isuse: boolean;
        sort: any;
    }
    interface SelectFormat {
        id: number | string;
        label: string;
    }
    interface StateTemplate extends SelectFormat {
        className?: string;
        classNameforG: string;
    }
    interface loginField {
        lang: string;
        account: string;
        password: string;
        img_vildate: string;
        rememberme: boolean;

    }
    interface AspNetRoles extends BaseEntityTable {
        Id?: string;
        Name?: string;
        aspNetUsers?: any[];
    }
    interface UserRoleInfo {
        role_id: string;
        role_use: boolean;
        role_name: string;
    }
    interface AspNetUsers extends BaseEntityTable {
        Id?: string;
        email?: string;
        emailConfirmed?: boolean;
        passwordHash?: string;
        securityStamp?: string;
        phoneNumber?: string;
        phoneNumberConfirmed?: boolean;
        twoFactorEnabled?: boolean;
        lockoutEndDateUtc?: Date;
        lockoutEnabled?: boolean;
        accessFailedCount?: number;
        UserName?: string;
        user_name_c?: string;
        department_id?: number;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Menu extends BaseEntityTable {
        menu_id?: number;
        parent_menu_id?: number;
        menu_name?: string;
        description?: string;
        area?: string;
        controller?: string;
        action?: string;
        icon_class?: string;
        sort?: number;
        is_folder?: boolean;
        is_use?: boolean;
        is_on_tablet?: boolean;
        is_only_tablet?: boolean;
        aspNetRoles?: server.AspNetRoles[];
        role_array?: Array<UserRoleInfo>;
    }
    interface Option {//分類管理選單用
        val?: number;
        Lname?: string;
    }
    interface Sales extends BaseEntityTable {
        //sales_id?: number;
        sales_no?: string;
        sales_name?: string;
        account?: string;
        password?: string;
        address?: string;
        gender?: boolean;
        rank?: number;
        recommend_no?: string;
        recommend_name?: string; //only client
        share_sn?: string;
        share_sort?: number;
        share_name?: string;
        join_date?: Date;
        sales_state?: number;
        birthday?: Date;
        tel?: string;
        mobile?: string;
        zip?: string;
        email?: string;
        city?: string;
        country?: string;
    }
    interface News extends BaseEntityTable {
        news_id?: number;
        news_title?: string;
        day?: any;
        news_info?: string;
        news_content?: string;
        sort?: number;
        i_Hide?: boolean;
    }
    interface Banner extends BaseEntityTable {
        banner_id?: number;
        banner_name?: string;
        sort?: number;
        i_Hide?: boolean;
    }
    interface Event extends BaseEntityTable {
        event_id?: number;
        event_title?: string;
        show_banner?: boolean;
        banner_url?: string;
        event_info?: string;
        event_content?: string;
        sort?: number;
        i_Hide?: boolean;
    }
    interface FaqCategory extends BaseEntityTable {
        faq_category_id?: number;
        category_name?: string;
        sort?: number;
        i_Hide?: boolean;
        faq?: server.Faq[];
    }
    interface Faq extends BaseEntityTable {
        faq_id?: number;
        faq_category_id?: number;
        faq_title?: string;
        faq_content?: string;
        sort?: number;
        i_Hide?: boolean;
        FaqCategory?: server.FaqCategory;
    }
    interface Editor extends BaseEntityTable {
        editor_id?: number;
        name?: string;
        sort?: number;
        i_Hide?: boolean;
        EditorDetail?: server.EditorDetail[];
    }
    interface EditorDetail extends BaseEntityTable {
        editor_detail_id?: number;
        editor_id?: number;
        detail_name?: string;
        detail_content?: string;
        sort?: number;
        i_Hide?: boolean;
        edit_state?: EditState;
        Editor?: server.Editor;
    }
    interface L1 extends BaseEntityTable {
        l1_id?: number;
        l1_name?: string;
        l2_list?: Array<server.L2>
    }
    interface L2 extends BaseEntityTable {
        l2_id?: number;
        l2_name?: string;
    }
} 