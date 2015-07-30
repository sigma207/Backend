package com.jelly.jt8.bo.model;

/**
 * Created by user on 2015/7/28.
 */
public class RolePermission {
    private int role_id;
    private int permission_id;

    public RolePermission(int role_id, int permission_id) {
        this.role_id = role_id;
        this.permission_id = permission_id;
    }

    public int getRole_id() {
        return role_id;
    }

    public int getPermission_id() {
        return permission_id;
    }
}
