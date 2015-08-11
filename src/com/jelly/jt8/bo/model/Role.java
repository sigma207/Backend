package com.jelly.jt8.bo.model;

import java.util.List;

/**
 * Created by user on 2015/7/28.
 */
public class Role {
    private int role_id;
    private int parent_role_id;
    private String role_code;
    private String role_name;
    private String update_time;
    private byte[] rv;
    private List<RolePermission> permissionList;

    public int getRole_id() {
        return role_id;
    }

    public void setRole_id(int role_id) {
        this.role_id = role_id;
    }

    public int getParent_role_id() {
        return parent_role_id;
    }

    public void setParent_role_id(int parent_role_id) {
        this.parent_role_id = parent_role_id;
    }

    public String getRole_code() {
        return role_code;
    }

    public void setRole_code(String role_code) {
        this.role_code = role_code;
    }

    public String getRole_name() {
        return role_name;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    public String getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(String update_time) {
        this.update_time = update_time;
    }

    public byte[] getRv() {
        return rv;
    }

    public void setRv(byte[] rv) {
        this.rv = rv;
    }

    public List<RolePermission> getPermissionList() {
        return permissionList;
    }

    public void setPermissionList(List<RolePermission> permissionList) {
        this.permissionList = permissionList;
    }
}
