import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [mutualFriends, setMutualFriends] = useState([]); 
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const { userId } = useParams(); 
  const navigate = useNavigate(); 

  const token = localStorage.getItem('token');
  const headers = {
    headers: {
      'x-auth-token': token,
    },
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://frenzy-assignment.onrender.com/api/auth/users/${userId}`, headers);
        setUserProfile(response.data);

        const friendsRes = await axios.get('https://frenzy-assignment.onrender.com/api/friends/allFriends', headers);
        setIsFriend(friendsRes.data.some(friend => friend._id === userId));

        const mutualRes = await axios.post(`https://frenzy-assignment.onrender.com/api/friends/mutualFriend/${userId}`, {}, headers);
        setMutualFriends(mutualRes.data.mutualFriends); 
      } catch (error) {
        console.error('Error fetching user profile or mutual friends', error);
        setError('Error fetching user profile or mutual friends');
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      await axios.post(`https://frenzy-assignment.onrender.com/api/friends/request/${userId}`, {}, headers);
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to send friend request', error);
      setError('Failed to send friend request');
    }
  };

  const handleUnfriend = async () => {
    try {
      await axios.post(`https://frenzy-assignment.onrender.com/api/friends/unfriend/${userId}`, {}, headers);
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to unfriend user', error);
      setError('Failed to unfriend user');
    }
  };

 
  const viewMutualFriendProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {userProfile ? (
        <Card>
          <CardContent>
            <Typography variant="h4">{userProfile.username}</Typography>
            <Typography variant="h6">Name: {userProfile.name}</Typography>
            <Typography variant="body1">Bio: {userProfile.bio}</Typography>
            <Typography variant="body2">Hobbies: {userProfile.hobbies.join(', ')}</Typography>
            <Grid container spacing={2}>
              <Grid item>
                {!isFriend ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFriend}
                  >
                    Add Friend
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUnfriend}
                  >
                    Unfriend
                  </Button>
                )}
              </Grid>
            </Grid>

            <Typography variant="h6" className="mt-6">Mutual Friends</Typography>
            {mutualFriends.length > 0 ? (
              <List>
                {mutualFriends.map(friend => (
                  <ListItem key={friend._id} divider sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemText primary={friend.username} sx={{ flexGrow: 1 }} />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => viewMutualFriendProfile(friend._id)} 
                        sx={{ marginLeft: '16px' }} 
                      >
                        View Profile
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No mutual friends</Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </div>
  );
};

export default UserProfile;
