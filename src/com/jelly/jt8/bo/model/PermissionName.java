package com.jelly.jt8.bo.model;

/**
 * Created by user on 2015/7/24.
 */
public class PermissionName {
    private int permission_id;
    private String language;
    private String name;

    public PermissionName() {
    }

    public PermissionName(int permission_id, String language, String name) {
        this.permission_id = permission_id;
        this.language = language;
        this.name = name;
    }

    public int getPermission_id() {
        return permission_id;
    }

    public void setPermission_id(int permission_id) {
        this.permission_id = permission_id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
