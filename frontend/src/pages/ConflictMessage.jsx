import React, { useState } from "react";
import { useEffect } from "react";
import { reverseParseGroupsConflict } from "../utlis/parsing";
import { conflictsChecks } from "../utlis/conflictsCheckess";
import { parseGroupsConflict } from "../utlis/parsing";
import { tokenLoader } from "../utlis/auth";
import { json, redirect } from "react-router-dom";

import { ConflictBtn } from "./ConflictMessageStyles";

const getGroupData = async (groupNum) => {
  const token1 = tokenLoader();
  const baseURL = "https://rate2rank-0d561bf6674a.herokuapp.com/";
  let groupResDate;
  let groupRes = await fetch(`${baseURL}/rate?group_number=${groupNum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token1,
    },
    // body: JSON.stringify({ group_number: groupNumInt }),
  });
  // TODO: raise errors to user
  if (groupRes.status === 422 || groupRes.status === 401) {
    return groupRes;
  }
  if (!groupRes.ok) {
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }
  groupResDate = await groupRes.json();
  return groupResDate.data.group_name;
};

const ConflictMessage = ({
  groupName,
  groups,
  currentGroup,
  groupRatingsData,
  isConflicToggle,
}) => {
  const [convertedGroups, setConvertedGroups] = useState([]);
  const [firstTempGroups, setFirstTempGroups] = useState([]);
  const [secondTempGroups, setSecondTempGroups] = useState([]);
  const [thirdTempGroups, setThirdTempGroups] = useState([]);
  const [orderedConflictGroups, setOrderedConflictGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [displayConflictNameGroup, setDisplayConflictNameGroup] = useState();
  const displayNameGroup = async (groupNum) => {
    let ConflictNameGroup = await getGroupData(groupNum);
    setDisplayConflictNameGroup(ConflictNameGroup);
  };

  console.log(groups);
  useEffect(() => {
    console.log(2);
    const convertedGroups = parseGroupsConflict(groups);
    const indexs = [];
    convertedGroups?.forEach((group, index) => {
      if (group[1] === groupRatingsData) {
        indexs.push(index);
      }
    });
    let tempGrops = convertedGroups?.slice(indexs[0], indexs.length);
    setConvertedGroups(convertedGroups);
    setFirstTempGroups(convertedGroups?.slice(0, indexs[0]));
    setSecondTempGroups(tempGrops);
    setThirdTempGroups(convertedGroups?.slice(indexs.length));
    setCurrentIndex(0);
    displayNameGroup(tempGrops[0][0]);
  }, [groups]);

  const finishConflict = async (orderdConflict) => {
    const baseURL = "https://rate2rank-0d561bf6674a.herokuapp.com/";
    const tok = tokenLoader();

    let result = [...firstTempGroups, ...orderdConflict, ...thirdTempGroups];
    console.log(result);
    const orderedConflict = reverseParseGroupsConflict(result);
    console.log(orderedConflict);
    let payload = {
      list_rank: orderedConflict,
      number_questions: 1,
    };
    let res = await fetch(baseURL + "rank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tok,
      },
      body: JSON.stringify(payload),
    });

    isConflicToggle(false);
  };

  const lowerRatings = () => {
    let orderdConflict = orderedConflictGroups;
    orderdConflict.push(secondTempGroups[currentIndex]);
    if (currentIndex === secondTempGroups.length - 1) {
      orderdConflict.push([currentGroup, groupRatingsData]);
      setOrderedConflictGroups(orderdConflict);
      finishConflict(orderdConflict);
    } else {
      setOrderedConflictGroups(orderdConflict);
    }
    let tempCurIndex = currentIndex + 1;
    setCurrentIndex(tempCurIndex);
    displayNameGroup(secondTempGroups[tempCurIndex][0]);
    // setAnswer(false);
  };
  const higherRatings = () => {
    let orderdConflict = orderedConflictGroups;
    console.log(currentIndex);
    console.log(secondTempGroups.slice(currentIndex));

    orderdConflict.push([parseInt(currentGroup), groupRatingsData]);
    orderdConflict = [
      ...orderdConflict,
      ...secondTempGroups.slice(currentIndex),
    ];
    console.log(orderdConflict);
    setOrderedConflictGroups(orderdConflict);
    finishConflict(orderdConflict);
    // setAnswer(true);
  };
  console.log(displayConflictNameGroup);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <h2 style={{ color: "#000" }}>
        You gave the same evaluation to team:
        {console.log(secondTempGroups[currentIndex])}
        {/* {displayNameGroup(secondTempGroups[currentIndex][0])} */}
        {secondTempGroups?.length > 0 ? (
          <span>
            {" "}
            {secondTempGroups[currentIndex][0]}{" "}
            {displayConflictNameGroup ? displayConflictNameGroup : ""}
          </span>
        ) : (
          "czxczx"
        )}{" "}
        and team:{currentGroup} {groupName}
      </h2>
      <p style={{ color: "#000" }}>
        Which is better ?<br />
        {/* {secondTempGroups.length > 0
          ? secondTempGroups[currentIndex][0]
          : "czxczx"}{" "}
        or {currentGroup} */}
      </p>
      <div className="actionsBtns" style={{ display: "flex" }}>
        <ConflictBtn onClick={() => lowerRatings()}>
          Team:
          {secondTempGroups?.length > 0
            ? secondTempGroups[currentIndex][0]
            : "czxczx"}
        </ConflictBtn>
        <ConflictBtn onClick={() => higherRatings()}>
          Team:{currentGroup}
        </ConflictBtn>
      </div>
    </div>
  );
};

export default ConflictMessage;
