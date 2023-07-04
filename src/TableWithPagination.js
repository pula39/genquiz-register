import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './TableWithPagination.css'


function TableWithPagination(props) {
  const [data, setData] = useState([]); // API로부터 가져온 데이터를 저장할 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const itemsPerPage = 10; // 페이지당 표시할 항목 수
  const pageCount = Math.ceil(data.length / itemsPerPage); // 전체 페이지 수

  // API 호출을 통해 데이터 가져오기
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(props.baseUrl + `/question-items-entities?page=0&size=1000`); // API_ENDPOINT는 실제 API의 URL로 대체되어야 합니다.
      setData(response.data); // 가져온 데이터를 상태에 저장
    } catch (error) {
      console.error(error);
    }
  };

  // 현재 페이지의 데이터를 가져옵니다.
  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // 페이지 변경 시 호출되는 콜백 함수
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Question Item Seq</th>
            <th>Question Item UUID</th>
            <th>Main Category</th>
            <th>Reg User ID</th>
            <th>Ask Text</th>
            <th>Answer Option JSON</th>
            <th>Answer Solution JSON</th>
            <th>Content Data JSON</th>
            <th>Reg Date Time</th>
            <th>Edited Date Time</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPageData().map(item => (
            <tr key={item.questionItemUUID}>
              <td>
                <button
                  onClick={() => props.onClickItem(item)}
                >
                  선택 
                </button>
              </td>
              <td>{item.questionItemSeq}</td>
              <td>{item.questionItemUUID}</td>
              <td>{item.mainCategory}</td>
              <td>{item.regUserId}</td>
              <td>{item.askText}</td>
              <td>{JSON.stringify(item.answerOptionJson)}</td>
              <td>{JSON.stringify(item.answerSolutionJson)}</td>
              <td>{JSON.stringify(item.contentDataJson)}</td>
              <td>{item.regDateTime}</td>
              <td>{item.editedDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}

        activeClassName={'item active '}
        breakClassName={'item break-me '}
        breakLabel={'...'}
        containerClassName={'pagination'}
        disabledClassName={'disabled-page'}
        nextClassName={"item next "}
        nextLabel={">>>"}
        pageClassName={'item pagination-page '}
        previousClassName={"item previous"}
        previousLabel={"<<<"}
      />
    </div>
  );
};

export default TableWithPagination;