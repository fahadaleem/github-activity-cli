#!/usr/bin/env node

const [, , username] = process.argv;

(async () => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`
    );
    if (response.status === 200) {
      const activities = await response.json();
      if (!activities.length) {
        console.log("No recent activity found!");
      } else {
        activities.forEach((activity) => {
          if (activity.type === "PushEvent") {
            console.log(
              `Pushed ${activity.payload.commits.length} to ${activity.repo.name}`
            );
          } else if (activity.type === "CreateEvent") {
            console.log(
              `Created ${activity.payload.ref_type} in ${activity.repo.name}`
            );
          } else if (activity.type === "IssuesEvent") {
            console.log(
              `${
                activity.payload.action.charAt(0).toUpperCase() +
                activity.payload.action.slice(1)
              } an issue in ${activity.repo.name}`
            );
          } else if (activity.type === "WatchEvent") {
            console.log(`Starred ${activity.repo.name}`);
          } else if (activity.type === "ForkEvent") {
            console.log(`Forked ${activity.repo.name}`);
          } else {
            console.log(
              `${activity.type.replace("Event", "")} in ${activity.repo.name}`
            );
          }
        });
      }
    } else {
      const err = await response.json();
      throw err;
    }
  } catch (err) {
    console.log(err.message);
  }
})();
