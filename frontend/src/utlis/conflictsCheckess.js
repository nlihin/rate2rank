import { tokenLoader } from "../utlis/auth";
import { reverseParseGroupsConflict } from "./parsing";

export const conflictsChecks = async (
  convertedGroups,
  indexs,
  answer,
  currentGroup,
  groupRatingsData,
  setQuestion
) => {
  const tok = tokenLoader();
  convertedGroups?.forEach((group, index) => {
    if (group[1] === groupRatingsData) {
      indexs.push(index);
    }
  });
  console.log(3);
  const baseURL = "http://127.0.0.1:5000/";
  let firstTempGroups = convertedGroups?.slice(0, indexs[0]);
  let secondTempGroups = convertedGroups?.slice(indexs[0], indexs.length);
  let thirdTempGroups = convertedGroups?.slice(indexs.length);
  let orderedConflictGroup = [];
  for (let i = 0; i < secondTempGroups?.length; i++) {
    console.log(i);
    setQuestion(`group ${secondTempGroups[i][0]} or group ${currentGroup}?`);

    if (answer) {
      orderedConflictGroup.push(secondTempGroups[i]);
      if (i === secondTempGroups?.length - 1)
        orderedConflictGroup.push([currentGroup, groupRatingsData]);
    } else {
      orderedConflictGroup.push([currentGroup, groupRatingsData]);
      orderedConflictGroup = [
        ...orderedConflictGroup,
        ...secondTempGroups.slice(i),
      ];
      break;
    }
  }
  console.log(firstTempGroups);
  console.log(thirdTempGroups);
  console.log(orderedConflictGroup);
  let result = [
    ...firstTempGroups,
    ...orderedConflictGroup,
    ...thirdTempGroups,
  ];

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
};