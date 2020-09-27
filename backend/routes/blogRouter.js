var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var Blogs=require('../models/blogs');
var authenticate=require('../authenticate');
const user = require('../models/user');
var blogRouter = express.Router();

blogRouter.use(bodyParser.json());

blogRouter.route('/')
.get((req,res,next) => {
    Blogs.find({})
    .populate('author')
    .populate('comments.author')
    .then((blogs)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(blogs);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    console.log(req.user.user);
    req.body.author= req.user.user._id;
    
    console.log(req.body);
    Blogs.create(req.body)
    .then((blog) => {
        console.log('Blog added ', blog);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
        // res.end();
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogs');
    
})
.delete([authenticate.verifyUser,authenticate.verifyAdmin],(req, res, next) => {
    Blogs.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

blogRouter.route('/:blogId')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('author')
    .populate('comments.author')
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post([authenticate.verifyUser,authenticate.verifyAdmin],(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /blogs/'+ req.params.blogId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog)=>{
        if(blog){
            console.log(req.user.user._id);
            console.log(blog.author);
            if(blog.author.equals(req.user.user._id)){
                if(req.body.name)
                    blog.name=req.body.name;
                if(req.body.description)
                    blog.description=req.body.description;
                
                blog.save()
                .then(blog=>{
                    Blogs.findById(blog._id)
                    .populate('author')
                    .populate('comments.author')
                    .then(blog=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(blog);
                    })
                })
            }
            else{
                err = new Error('you are not allowed to update this blog');
                next(err);
            }
        }
        else{
            err= new Error("this blog doesn't exist");
            err=>next(err);
        }
    })
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog)=>{
        if(blog){
            if(blog.author.equals(req.user.user._id)){
                Blogs.findByIdAndRemove(req.params.blogId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
            }
            else{
                err = new Error('you are not allowed to delete this blog');
                next(err);
            }
        }
        else{
            err= new Error("this blog doesn't exist");
            err=>next(err);
        }
    })
    .catch((err) => next(err));
});
blogRouter.route('/:blogId/likes')

.post(authenticate.verifyUser,(req,res,next)=>{
    Blogs.findById(req.params.blogId)
    .then((blog)=>{
        if(blog){
            const like=blog.like.filter(id=> id!=req.user.user._id);
            blog.like=like;
            blog.save()
            .then(blog=>{
                Blogs.findById(blog._id)
                .populate('author')
                .populate('comments.author')
                .then(blog=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);
                })
            })
        }
        else
        {
            err = new Error('this blog does not exist');
            next(err);
        }
    })
    .catch(err=> next(err));
})

blogRouter.route('/:blogId/comments')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('comments.author')
    .then((blog) => {
        if (blog != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(blog.comments);
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            req.body.author=req.user.user._id;
            blog.comments.push(req.body);
            blog.save()
            .then((blog) => {
                Blogs.findById(blog._id)
                    .populate('comments.author')
                    .then((blog)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(blog);
                    })
                                
            }, (err) => next(err));
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogs/'
        + req.params.blogId + '/comments');
})
.delete([authenticate.verifyUser,authenticate.verifyAdmin],(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            for (var i = (blog.comments.length -1); i >= 0; i--) {
                blog.comments.id(blog.comments[i]._id).remove();
            }
            blog.save()
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);                
            }, (err) => next(err));
        }
        else {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

blogRouter.route('/:blogId/comments/:commentId')
.get((req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('comments.author')
    .then((blog) => {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(blog.comments.id(req.params.commentId));
        }
        else if (blog == null) {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /blogs/'+ req.params.blogId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {
            if(blog.comments.id(req.params.commentId).author.equals(req.user.user._id))
            {
                if (req.body.comment) {
                    blog.comments.id(req.params.commentId).comment = req.body.comment;                
                }
                blog.save()
                .then((blog) => {
                    Blogs.findById(blog._id)
                    .populate('comments.author')
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);                
                }, (err) => next(err));
            }
            else {
                err.status=403;
                err = new Error('you are not authorised to update this comment');
                return next(err);
            }
            
        }
        else if (blog == null) {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null && blog.comments.id(req.params.commentId) != null) {
            if(blog.comments.id(req.params.commentId).author.equals(req.user.user._id)){
                blog.comments.id(req.params.commentId).remove();
                blog.save()
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);                
                }, (err) => next(err));
            }
            else{
                err.status=403;
                err = new Error('you are not authorised to delete this comment');
                return next(err);
            }
            
        }
        else if (blog == null) {
            err = new Error('blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = blogRouter;