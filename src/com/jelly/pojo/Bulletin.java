package com.jelly.pojo;

/**
 * Created by user on 2015/6/12.
 */
public class Bulletin {
    String title;
    String content;

    public Bulletin(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
