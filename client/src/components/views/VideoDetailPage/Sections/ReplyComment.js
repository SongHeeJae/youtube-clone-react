import React, {useEffect, useState} from 'react'
import SingleComment from './SingleComment';


function ReplyComment(props) {
    const videoId = props.postId;
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        })

        setChildCommentNumber(commentNumber);
    }, [props.commentLists])

    const renderReplyComment = (parentCommentId) => (
        props.commentLists.map((comment, index) => (
                <React.Fragment>
                    {comment.responseTo === parentCommentId &&
                    <div style={{width:'80%', marginLeft:'40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>
                        <ReplyComment parentCommentId={comment._id} commentLists={props.commentLists} refreshFunction={props.refreshFunction} postId={videoId}/>
                    </div>
                    }
                </React.Fragment>
            
        ))

    );

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    
    return (
        <div>
            {
                ChildCommentNumber > 0 &&
                
                    <p style={{fontSize:'14px', margin:0, color:'grey'}} onClick={onHandleChange}>
                        View {ChildCommentNumber} more comment(s)
                    </p>
                    
            }

            {
                OpenReplyComments &&
                renderReplyComment(props.parentCommentId)}
            
                
            
            
        </div>
    )
    
}

export default ReplyComment
