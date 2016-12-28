import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
// I import everything because otherwise switchMap isn't defined
//import 'rxjs/Rx';
import 'rxjs';

import { PostService } from '../shared/post.service';


import * as Showdown from 'showdown';

@Component({
    templateUrl: './views/blog-post.component.html',
})
export class BlogPostComponent {
    post;

    constructor(activatedRoute: ActivatedRoute, posts: PostService, title: Title) {
        activatedRoute.params.switchMap((params) => {
            let filter;
            if (!params['id']) {
                // If none specified, just get last, it should already be sorted by date
                filter = list => list[Object.keys(list)[Object.keys(list).length-1]]
            } else {
                // Otherwise, get specified
                filter = list => list[params['id']];
            }
            return posts.data.map(response => {

                let item = filter(response);
                title.setTitle(item.title + ' | fluin.io blog');
                let converter = new Showdown.Converter();
                converter.setOption('noHeaderId', 'true');
                item.renderedBody = converter.makeHtml(item.body);
                item.renderedBody = item.renderedBody.replace(/[\r\n]/g, '');
                return item;
            })
        }).subscribe(post => {
            this.post = post;
        });

    }
}
