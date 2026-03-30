"use client";

const KEYS = {
  posts: "rc_local_posts",
  interests: "rc_post_interests",
  reviews: "rc_reviews",
  reports: "rc_reports",
};

function readJson(key, fallback = []) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalPosts() {
  return readJson(KEYS.posts, []);
}

export function saveLocalPost(post) {
  const all = getLocalPosts();
  const existingIndex = all.findIndex((p) => p._id === post._id);
  if (existingIndex >= 0) {
    all[existingIndex] = { ...all[existingIndex], ...post };
  } else {
    all.unshift(post);
  }
  writeJson(KEYS.posts, all);
  return post;
}

export function getMergedPosts(remotePosts = []) {
  const local = getLocalPosts();
  const byId = new Map();
  [...local, ...remotePosts].forEach((post) => {
    if (post?._id) byId.set(post._id, post);
  });
  return Array.from(byId.values());
}

export function getPostById(postId, remotePosts = []) {
  return getMergedPosts(remotePosts).find((p) => p._id === postId) || null;
}

export function getInterests() {
  return readJson(KEYS.interests, []);
}

export function saveInterests(interests) {
  writeJson(KEYS.interests, interests);
}

export function expressInterest(post, interestedUser) {
  const interests = getInterests();
  const already = interests.find(
    (i) => i.postId === post._id && i.userId === interestedUser._id
  );
  if (already) return already;

  const interest = {
    id: `${post._id}_${interestedUser._id}`,
    postId: post._id,
    ownerId: post.author?._id,
    ownerName: post.author?.name,
    userId: interestedUser._id,
    userName: interestedUser.name,
    userPhone: interestedUser.phone,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  interests.push(interest);
  saveInterests(interests);
  return interest;
}

export function getInterestsByPost(postId) {
  return getInterests().filter((i) => i.postId === postId);
}

export function getPendingInterestsForOwner(ownerId) {
  return getInterests().filter((i) => i.ownerId === ownerId && i.status === "pending");
}

export function approveInterest({ postId, userId, ownerId }) {
  const interests = getInterests();
  const index = interests.findIndex(
    (i) => i.postId === postId && i.userId === userId && i.ownerId === ownerId
  );
  if (index === -1) return null;
  interests[index] = { ...interests[index], status: "approved", approvedAt: new Date().toISOString() };
  saveInterests(interests);
  return interests[index];
}

export function isApprovedParticipant(postId, userId) {
  return getInterests().some(
    (i) => i.postId === postId && i.userId === userId && i.status === "approved"
  );
}

export function canViewContact(post, userId) {
  if (!userId) return false;
  if (post.author?._id === userId) return true;
  return isApprovedParticipant(post._id, userId);
}

export function getTripsForUser(userId, remotePosts = []) {
  const posts = getMergedPosts(remotePosts);
  const interests = getInterests();

  const offered = posts.filter((p) => p.author?._id === userId);
  const approvedAsPassenger = interests
    .filter((i) => i.userId === userId && i.status === "approved")
    .map((i) => posts.find((p) => p._id === i.postId))
    .filter(Boolean);

  return {
    offered,
    requested: approvedAsPassenger,
  };
}

export function getReviews() {
  return readJson(KEYS.reviews, []);
}

export function submitReview(review) {
  const reviews = getReviews();
  const existing = reviews.find(
    (r) =>
      r.postId === review.postId &&
      r.fromUserId === review.fromUserId &&
      r.toUserId === review.toUserId
  );
  if (existing) return existing;

  const newReview = {
    _id: `${review.postId}_${review.fromUserId}_${review.toUserId}`,
    ...review,
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  writeJson(KEYS.reviews, reviews);
  return newReview;
}

export function getReviewsForUser(userId) {
  const reviews = getReviews();
  return {
    received: reviews.filter((r) => r.toUserId === userId),
    given: reviews.filter((r) => r.fromUserId === userId),
  };
}

export function createReport(reportPayload) {
  const reports = readJson(KEYS.reports, []);
  const report = {
    _id: `rep_${Date.now()}`,
    ...reportPayload,
    createdAt: new Date().toISOString(),
  };
  reports.push(report);
  writeJson(KEYS.reports, reports);
  return report;
}
