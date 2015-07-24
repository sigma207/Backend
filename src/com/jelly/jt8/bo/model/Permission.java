package com.jelly.jt8.bo.model;

import java.util.List;
import java.util.Map;

/**
 * Created by user on 2015/7/24.
 */
public class Permission {
    private int permission_id;
    private String permission_code;
    private int parent_permission_id;
    private int sequence;
    private Map<String,String> permissionNameMap;

    public Permission(int permission_id, String permission_code, int parent_permission_id, int sequence) {
        this.permission_id = permission_id;
        this.permission_code = permission_code;
        this.parent_permission_id = parent_permission_id;
        this.sequence = sequence;
    }

    public int getPermission_id() {
        return permission_id;
    }

    public String getPermission_code() {
        return permission_code;
    }

    public int getParent_permission_id() {
        return parent_permission_id;
    }

    public int getSequence() {
        return sequence;
    }

    public Map<String, String> getPermissionNameMap() {
        return permissionNameMap;
    }

    public void setPermission_id(int permission_id) {
        this.permission_id = permission_id;
    }

    public void setPermission_code(String permission_code) {
        this.permission_code = permission_code;
    }

    public void setParent_permission_id(int parent_permission_id) {
        this.parent_permission_id = parent_permission_id;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
    }

    public void setPermissionNameMap(Map<String, String> permissionNameMap) {
        this.permissionNameMap = permissionNameMap;
    }
}
