import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { List, Item } from "./HomeStyles";
import { tokenLoader } from "../utlis/auth";
import { json, redirect } from "react-router-dom";

const getAvailGroups = async () => {
  const token1 = tokenLoader();
  const baseURL = "https://rate2rank-0d561bf6674a.herokuapp.com/";
  // TODO: save base url in constants and import
  const res = await fetch(baseURL + "group", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token1,
    },
  });
  if (res.status === 422 || res.status === 401) {
    return res;
  }
  if (!res.ok) {
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }
  let resData = await res.json();

  return resData.data;
};

const getGroupData = async (groupNum) => {
  const token1 = tokenLoader();
  const baseURL = "http://127.0.0.1:5000";
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
  return groupResDate.data;
};

const getAllGroupsData = async (groupsNums) => {
  let groupsData = [];
  for (let i = 0; i < groupsNums.length; i++) {
    let groupNum = groupsNums[i];
    let singGroupData = await getGroupData(groupNum);
    singGroupData["groupNum"] = groupNum;
    groupsData.push(singGroupData);
  }
  return groupsData;
};

const Home = () => {
  // const groups = await GetGroups();
  const [availGroups, setAvailGroups] = useState({});
  const [groups, setGroups] = useState({});

  // useEffect(() => {
  //   const GetGroups = async () => {
  //     const token1 = tokenLoader();
  //     const baseURL = "http://127.0.0.1:5000/";
  //     // TODO: save base url in constants and import
  //     const res = await fetch(baseURL + "group", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: "Bearer " + token1,
  //       },
  //     });
  //     if (res.status === 422 || res.status === 401) {
  //       return res;
  //     }
  //     if (!res.ok) {
  //       throw json(
  //         { message: "Could not authenticate user." },
  //         { status: 500 }
  //       );
  //     }
  //     let resData = await res.json();
  //     let groupRes, groupResDate;
  //     // if (groups) {
  //     //   resDataCopy = JSON.parse(JSON.stringify({ ...groups }));
  //     // }
  //     Object.keys(resData.data).forEach(async (groupNum) => {
  //       // let resDataCopy = JSON.parse(JSON.stringify({ ...groups }));
  //       let resDataCopy = {};

  //       groupRes = await fetch(baseURL + "rate/" + groupNum, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           Authorization: "Bearer " + token1,
  //         },
  //         // body: JSON.stringify({ group_number: groupNumInt }),
  //       });
  //       // TODO: raise errors to user
  //       if (res.status === 422 || res.status === 401) {
  //         return res;
  //       }
  //       if (!res.ok) {
  //         throw json(
  //           { message: "Could not authenticate user." },
  //           { status: 500 }
  //         );
  //       }
  //       groupResDate = await groupRes.json();
  //       console.log(groupResDate);
  //       resDataCopy[groupNum] = {
  //         rated: resData.data[groupNum],
  //         ...groupResDate.data,
  //       };
  //       console.log(resDataCopy);
  //       setGroups({ ...groups, ...resDataCopy });
  //     });

  //     // console.log(resDataCopy);
  //   };

  //   GetGroups();
  // }, []);

  useEffect(() => {
    const updateAvailGroupsData = async () => {
      let availGroups = await getAvailGroups();
      setAvailGroups({ ...availGroups });
    };
    updateAvailGroupsData();
  }, []);

  useEffect(() => {
    const updateGroupsData = async () => {
      let totalGroupData = {};
      let tempAvailGroups = availGroups;
      console.log(tempAvailGroups);
      let allGroupsData = await getAllGroupsData(Object.keys(tempAvailGroups));
      console.log(allGroupsData);
      for (let i = 0; i < allGroupsData.length; i++) {
        let group = allGroupsData[i];
        let groupNum = group["groupNum"];
        totalGroupData[groupNum] = { rated: availGroups[groupNum], ...group };
      }

      console.log(totalGroupData);
      setGroups({ ...totalGroupData });
      return totalGroupData;
    };
    let x = updateGroupsData();
    console.log(x);
  }, [availGroups]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h2 style={{ color: "#000", marginBottom: "30px" }}>Today's Teams:</h2>
      <List>
        {Object.keys(groups)?.map((groupNum) => (
          <Item key={groupNum}>
            <Card
              groupName={groups[groupNum]["group_name"]}
              GroupStatus={groups[groupNum]["rated"]}
              groupNum={groupNum}
              // groupQuestions={groups.groupNum?.questions}
            />
          </Item>
        ))}
      </List>
    </div>
  );
};

export default Home;
