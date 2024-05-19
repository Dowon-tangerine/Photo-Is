import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./css/Qna.module.css";
import { FaAngleDown } from 'react-icons/fa';
import { getQnaList, getQnaSortList } from '../../apis/qnaApi';
// import axios from 'axios';


// interface imgInterface {
//     id: number;
//     url: string;
//     likeCnt: number,
//     liked: boolean,
//     title: string,
//   }

interface articleInterface{
    questionId: number,
    memberId: number,
    nickname: string,
    category: string,
    title: string,
    hasPhoto: boolean,
    viewCnt: number,
    createdAt: string,
}
  
const Qna: React.FC = () => {

    const [sortType, setSortType] = useState<String>("전체");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);

    const navigate = useNavigate();
    
    const moveToWrite = function(){
        navigate("/community/qna/writeqna")
    }

    const moveToQnaDetail = function(id: number){
        navigate("/community/qna/detail", { state: { id :  id} })
    }

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      const todayString = getTodayDateString();

    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }

    const [listNum, setListNum] = useState<number>(1231);

    useEffect(() => {
        setListNum(listNum);
    })

    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalNum, setTotalNum] = useState<number>(1);
    const [articleList, setArticleList] = useState<Array<articleInterface> | undefined>();

    useEffect(() => {
        getQnaList(currentPage)
        .then((res) => {
            setTotalNum(res.totalCnt);
            setArticleList(res.questionList);
            setTotalPage(res.paginationDataDto.totalPages);
            setCurrentPage(res.paginationDataDto.currentPage);
        })
    }, []);

    const pageMove = function(i : number){
        setCurrentPage(i);
        getQnaList(i)
        .then((res) => {
            setArticleList(res.questionList);
            setCurrentPage(res.paginationDataDto.currentPage);
        })
    }

    const renderPageButtons = () => {
        let pages = [];
        if (totalPage <= 10) {
        for (let i = 1; i <= totalPage; i++) {
            pages.push(
            <button
                key={i}
                onClick={() => {pageMove(i);}}
                className={currentPage === i ? styles.active : ''}
            >
                {i}
            </button>,
            );
        }
        } else {
        // 현재 페이지가 10 이상일 때의 페이지네이션 로직
        const startPage = Math.min(currentPage, totalPage - 9);
        for (let i = startPage; i < startPage + 10; i++) {
            pages.push(
            <button
                key={i}
                onClick={() => {pageMove(i);}}
                className={currentPage === i ? styles.active : ''}
            >
                {i}
            </button>
            );
        }
        }
        return pages;
    };

    // 현재 페이지가 총 페이지 수를 넘지 않게 오른쪽 화살표 클릭 핸들러
    const nextPage = () => {
        if (currentPage < totalPage) {
        setCurrentPage(currentPage + 1);
        pageMove(currentPage + 1);
        }
    };

    // 현재 페이지가 1보다 작지 않게 왼쪽 화살표 클릭 핸들러
    const prevPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        pageMove(currentPage - 1);
        }
    };

    const sortPage = function(type : string){
        setSortType(type); 

        if(type === '일반'){
            getQnaSortList('normal', 1)
            .then((res) => {
                setTotalNum(res.totalCnt);
                setArticleList(res.questionList);
                setTotalPage(res.paginationDataDto.totalPages);
                setCurrentPage(res.paginationDataDto.currentPage);
            })
        }
        else if(type === '스튜디오'){
            getQnaSortList('studio', 1)
            .then((res) => {
                setTotalNum(res.totalCnt);
                setArticleList(res.questionList);
                setTotalPage(res.paginationDataDto.totalPages);
                setCurrentPage(res.paginationDataDto.currentPage);
            })
        }
        if(type === '전체'){
            getQnaList(1)
            .then((res) => {
                setTotalNum(res.totalCnt);
                setArticleList(res.questionList);
                setTotalPage(res.paginationDataDto.totalPages);
                setCurrentPage(res.paginationDataDto.currentPage);
            })
        }
    }

    return (
        <>
        

        <div className={styles.main_container} style={{marginTop: '80px'}}>
            <div className={styles.page_intro}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-QnA-</p>
            </div>

            <div className={styles.article_title_container}>
                <p style={{fontSize : '32px'}}>{sortType}글</p>
                <p style={{marginTop : '-15px', marginBottom : '10px'}}>{totalNum}개의 글</p>

                <div className={styles.btn_container}>
                    <div className={styles.photo_btn} onClick={() => {moveToWrite();}}>
                        <p>글쓰기</p>
                    </div>
                    <div className={styles.sort_btn}>
                        <div className={styles.dropdown_container} onClick={() => {openSortTypeList();}}>
                            <p className={styles.dropdown_txt2}>{sortType}</p>
                            <FaAngleDown  className={`${styles.dropdown_icon2} ${isRotated2 ? styles.rotated : ''}`}/>
                        </div>

                        {sortTypeList && (
                            <>
                                <div className={styles.typeList_container2}>
                                    <p className={styles.type_txt2_1} onClick={() => {sortPage("전체"); openSortTypeList();}}>전체</p>
                                    <p className={styles.type_txt2_2} onClick={() => {sortPage("일반"); openSortTypeList();}}>일반</p>
                                    <p className={styles.type_txt2_3} onClick={() => {sortPage("스튜디오"); openSortTypeList();}}>스튜디오</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>

            <div className={styles.type_category_title_container}>
                <div className={styles.article_num}>
                    <p>No.</p>
                </div>
                <div className={styles.article_category} style={{justifyContent: 'center'}}>
                    <p>카테고리</p>
                </div>
                <div className={styles.article_title} style={{justifyContent: 'center'}}>
                    <p>제목</p>
                </div>
                <div className={styles.article_author} style={{justifyContent: 'center'}}>
                    <p>작성자</p>
                </div>
                <div className={styles.article_date} style={{justifyContent: 'center'}}>
                    <p>작성일</p>
                </div>
                <div className={styles.article_view} style={{justifyContent: 'center'}}>
                    <p>조회수</p>
                </div>
            </div>
            <div className={styles.article_container}>
                {articleList && 
                articleList.map((item : articleInterface) => (
                    <>
                    <div className={styles.type_category_title_container}>
                        <div className={styles.article_num}>
                            <p>{item.questionId}</p>
                        </div>
                        <div className={styles.article_category} style={{justifyContent: 'center'}}>
                            <div className={styles.category_btn}>
                                <p>{item.category === 'normal' ? '일반' : '스튜디오'}</p>
                            </div>
                        </div>
                        <div className={styles.article_title}>
                            {item.hasPhoto 
                            ?<>
                                <p className={styles.click_title} onClick={() => {moveToQnaDetail(item.questionId);}}>{item.title}</p>
                                <img src='/imgs/photo_icon.png' alt='사진아이콘' style={{height : '15px', width : 'auto'}}></img>
                            </>
                            : <>
                                <p className={styles.click_title} onClick={() => {moveToQnaDetail(item.questionId);}}>{item.title}</p>
                            </>}
                        </div>
                        <div className={styles.article_author}>
                            <p style={{cursor: 'pointer'}}>{item.nickname}</p>
                        </div>
                        <div className={styles.article_date} style={{justifyContent: 'center'}}>
                            <p>
                                {item.createdAt.slice(0, 10) === todayString ? (
                                item.createdAt.slice(11, 19)
                                ) : (
                                <>
                                    {item.createdAt.slice(0, 10)}<br />
                                </>
                                )}
                            </p>
                        </div>
                        <div className={styles.article_view} style={{justifyContent: 'center'}}>
                            <p>{item.viewCnt}</p>
                        </div>
                    </div>
                    </>
                ))}
            </div>

            <div className={styles.pages_container}>
                <div className={styles.pagination}>
                    <button onClick={() => {prevPage();}} disabled={currentPage === 1}>
                        <img src='/imgs/page_icon.png' style={{height: '17px', width: 'auto'}}></img>
                    </button>
                    {renderPageButtons()}
                    <button onClick={() => {nextPage();}} disabled={currentPage === totalPage}>
                        <img src='/imgs/right_page_icon.png' style={{height: '17px', width: 'auto'}}></img>
                    </button> 
                </div>
            </div>
        </div>
        </>
    );
};

export default Qna;
