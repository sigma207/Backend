package com.jelly.jt8.bo.model;

import java.util.List;

/**
 * Created by user on 2015/7/30.
 */
public class User {
    private String login_id;
    private String password;
    private String create_time;
    private int permission;//1
    private int concurrent;//1
    private int retry;
    private int max_retry;//5
    private String active_date;
    private int duration;
    private String expire_date;
    private String update_time;
    private int is_active;
    private String login_time;
    private String last_login_time;
    private String org_id;
    private List<UserRole> userRoleList;

    public User(String login_id, String password, String create_time, int permission, int concurrent, int retry, int max_retry, String active_date, int duration, String expire_date, String update_time, int is_active, String login_time, String last_login_time, String org_id) {
        this.login_id = login_id;
        this.password = password;
        this.create_time = create_time;
        this.permission = permission;
        this.concurrent = concurrent;
        this.retry = retry;
        this.max_retry = max_retry;
        this.active_date = active_date;
        this.duration = duration;
        this.expire_date = expire_date;
        this.update_time = update_time;
        this.is_active = is_active;
        this.login_time = login_time;
        this.last_login_time = last_login_time;
        this.org_id = org_id;
    }

    public String getLogin_id() {
        return login_id;
    }

    public void setLogin_id(String login_id) {
        this.login_id = login_id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public int getPermission() {
        return permission;
    }

    public void setPermission(int permission) {
        this.permission = permission;
    }

    public int getConcurrent() {
        return concurrent;
    }

    public void setConcurrent(int concurrent) {
        this.concurrent = concurrent;
    }

    public int getRetry() {
        return retry;
    }

    public void setRetry(int retry) {
        this.retry = retry;
    }

    public int getMax_retry() {
        return max_retry;
    }

    public void setMax_retry(int max_retry) {
        this.max_retry = max_retry;
    }

    public String getActive_date() {
        return active_date;
    }

    public void setActive_date(String active_date) {
        this.active_date = active_date;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getExpire_date() {
        return expire_date;
    }

    public void setExpire_date(String expire_date) {
        this.expire_date = expire_date;
    }

    public String getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(String update_time) {
        this.update_time = update_time;
    }

    public int getIs_active() {
        return is_active;
    }

    public void setIs_active(int is_active) {
        this.is_active = is_active;
    }

    public String getLogin_time() {
        return login_time;
    }

    public void setLogin_time(String login_time) {
        this.login_time = login_time;
    }

    public String getLast_login_time() {
        return last_login_time;
    }

    public void setLast_login_time(String last_login_time) {
        this.last_login_time = last_login_time;
    }

    public String getOrg_id() {
        return org_id;
    }

    public void setOrg_id(String org_id) {
        this.org_id = org_id;
    }

    public List<UserRole> getUserRoleList() {
        return userRoleList;
    }

    public void setUserRoleList(List<UserRole> userRoleList) {
        this.userRoleList = userRoleList;
    }
}
