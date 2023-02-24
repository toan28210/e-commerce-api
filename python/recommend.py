from datetime import datetime
from flask import Flask,render_template,url_for,flash,redirect,request
from flask_sqlalchemy import SQLAlchemy
import csv
import sys

import sqlite3
import time
import datetime
import random
import pandas as pd
import matplotlib.pyplot as plt
import sklearn.metrics as metrics
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.spatial.distance import correlation
from sklearn.metrics.pairwise import pairwise_distances

from IPython.display import display, clear_output
from contextlib import contextmanager
import warnings
warnings.filterwarnings('ignore')
import os
import re
import seaborn as sns
from csv import reader, writer

def recommend(user_id):
	# _id,desc,title
	products = pd.read_csv('/Users/toantran/Downloads/DOAN_2/shopapi/data/products.csv', error_bad_lines=False, encoding="latin-1",dtype=object)
	products.columns = ["ISBN","desc","bookTitle"]
	# total_rows=len(products.axes[0])
	# y=[]
	# for i in range(total_rows):
	# 	i+= 1
	# 	y.append(i)
	# products["productId"] = y
	# print("booooook tesst: ",products.head())
	# products.columns = ["productid","id_category","bookTitle","ISBN"]
	# _id,email,password,phone,username
	users = pd.read_csv('/Users/toantran/Downloads/DOAN_2/shopapi/data/users.csv', error_bad_lines=False, encoding="latin-1")
	users.columns = ["userID","email","password","phone","name"]
	# adduserid = []
	# for i in range(len(users.axes[0])):
	# 	i+= 1
	# 	adduserid.append(i)
	# users["userId"] = adduserid
	# users.columns = ["userid","name","password","date_of_birth","gender","userID"]
	# result = users[users["userid"] == user_id]
	# user_id = result.iloc[0,5]
	# print("result: ", result.columns[0]['userid'])
	ratings = pd.read_csv('/Users/toantran/Downloads/DOAN_2/shopapi/data/ratings.csv', error_bad_lines=False, encoding="latin-1",dtype=object)
	# ratings1.columns = ["id","productid","bookRating","userid"]
	# hel = pd.merge(ratings1,users, on='userid', how='inner')
	# test = hel.drop(['password','gender','date_of_birth','name'] , axis=1)
	# testv1 = pd.merge(test,products, on='productid', how='inner')
	# ratings = testv1.drop(['id_category','bookTitle','productid','userid'] , axis=1)
	# ratingsadd = []
	# for i in range(len(ratings.axes[0])):
	# 	i+= 1
	# 	print(i)
	# 	ratingsadd.append(i)
	# ratings["idrating"] = ratingsadd
	
	# ratings = ratings.drop(['id'] , axis=1)
	# _id,productId,rating,userId
	ratings.columns = ["id","ISBN","bookRating","userID"]

	# print(ratings)
	
	# print(products.shape)
	# print(users.shape)
	# print(ratings.shape)
	products.head()
	#checking shapes of the datasets
	# print(products.shape)
	# print(users.shape)
	# print(ratings.shape)

	# products.head()

# 	#Now the products datasets looks like....
	products.head()

# 	#checking data types of columns
	products.dtypes
# 	#making this setting to display full text in columns
	pd.set_option('display.max_colwidth', -1)

# 	#resetting the dtype as int32
# 	# products.yearOfPublication = products.yearOfPublication.astype(np.int32)
# 	# print(products.dtypes)

# 	# print(users.shape)
	users.head()
	users.dtypes
	# ratings.userID=ratings.userID.astype(np.int64)
	ratings.userID=ratings.userID
	ratings.bookRating=ratings.bookRating.astype(np.int64)
# 	# print(ratings.dtypes)
	ratings.head(5)
	
	ratings_new = ratings[ratings.ISBN.isin(products.ISBN)]

# 	#ratings dataset should have ratings from users which exist in users dataset, unless new users are added to users dataset
	ratings = ratings[ratings.userID.isin(users.userID)]

# 	#Segragating implicit and explict ratings datasets
	ratings_explicit = ratings_new[ratings_new.bookRating != 0]
	ratings_implicit = ratings_new[ratings_new.bookRating == 0]

# 	#plotting count of bookRating
	sns.countplot(data=ratings_explicit , x='bookRating')
	# plt.show()

# 	#A simple popularity based recommendation system based on count of user ratings for different products
	def new_user_recommendation():
		ratings_count = pd.DataFrame(ratings_explicit.groupby(['ISBN'])['bookRating'].sum())
		# print(ratings.count)
		top10 = ratings_count.sort_values('bookRating', ascending = False).head(5)
	    # print("Following products are recommended")
		top=top10.merge(products, left_index = True, right_on = 'ISBN')
		return top

# 	#Similarly segregating users who have given explicit ratings from 1-10 and those whose implicit behavior was tracked
	users_exp_ratings = users[users.userID.isin(ratings_explicit.userID)]
	users_imp_ratings = users[users.userID.isin(ratings_implicit.userID)]


	#We are considering users who have rated atleast 1 products
	#and products which have atleast 1 ratings
	counts1 = ratings_explicit['userID'].value_counts()
	ratings_explicit = ratings_explicit[ratings_explicit['userID'].isin(counts1[counts1 >= 1].index)]
	counts = ratings_explicit['bookRating'].value_counts()
	ratings_explicit = ratings_explicit[ratings_explicit['bookRating'].isin(counts[counts >= 1].index)]

# 	#Generating ratings matrix from explicit ratings table
	ratings_matrix = ratings_explicit.pivot(index='userID', columns='ISBN', values='bookRating')
	userID = ratings_matrix.index
	# print("userUUSUSU",userID)
	ISBN = ratings_matrix.columns
	# print("IDSNNSNNS", ISBN)
	# print(ratings_matrix.shape)
	ratings_matrix.head()
	# print("rating matric",ratings_matrix.head())

# 	#since NaNs cannot be handled by training algorithms, replacing these by 0, which indicates absence of ratings
# 	#setting data type
	ratings_matrix.fillna(0, inplace = True)
	ratings_matrix = ratings_matrix.astype(np.int32)
	# print("ratin matrix part 2: ", ratings_matrix)

# 	#setting global variables
	global metric,k
	k=3
	metric='cosine'

# 	#This function finds k similar users given the user_id and ratings matrix 
# 	#These similarities are same as obtained via using pairwise_distances
	def findksimilarusers(user_id, ratings, metric = metric, k=k):
		similarities=[]
		indices=[]
		model_knn = NearestNeighbors(metric = metric, algorithm = 'brute') 
		model_knn.fit(ratings)
		loc = ratings.index.get_loc(user_id)
		distances, indices = model_knn.kneighbors(ratings.iloc[loc, :].values.reshape(1, -1), n_neighbors = k+1)
		similarities = 1-distances.flatten()
		return similarities,indices


# 	#This function predicts rating for specified user-item combination based on user-based approach
	def predict_userbased(user_id, item_id, ratings, metric = metric, k=k):
		prediction=0
		user_loc = ratings.index.get_loc(user_id)
		item_loc = ratings.columns.get_loc(item_id)
		similarities, indices=findksimilarusers(user_id, ratings,metric, k) #similar users based on cosine similarity
		mean_rating = ratings.iloc[user_loc,:].mean() #to adjust for zero based indexing
		sum_wt = np.sum(similarities)-1
		product=1
		wtd_sum = 0
		for i in range(0, len(indices.flatten())):
			if indices.flatten()[i] == user_loc:
				continue;
			else: 
				ratings_diff = ratings.iloc[indices.flatten()[i],item_loc]-np.mean(ratings.iloc[indices.flatten()[i],:])
				product = ratings_diff * (similarities[i])
				wtd_sum = wtd_sum + product
	    
	    #in case of very sparse datasets, using correlation metric for collaborative based approach may give negative ratings
	    #which are handled here as below
		if sum_wt==0.0 :
			sum_wt=0.1
		prediction = int(round(mean_rating + (wtd_sum/sum_wt)))
		if prediction <= 0:
			prediction = 1   
		elif prediction >10:
			prediction = 10
	    # print('\nPredicted rating for user {0} -> item {1}: {2}'.format(user_id,item_id,prediction))
		# print("Predictionhahahahaah:", prediction)
		return prediction


# 	# print(products.dtypes)
# 	# print()
# 	# print(ratings.dtypes)
# 	# print()
# 	# print(users.dtypes)

	def predicting_user_based_rating(uid,iid):
		return predict_userbased(uid,iid,ratings_matrix);
	uid='63a45692de2d38369619b1ed'
	iid= '62a4c7558f1baabb80f6f8ee'
	predicting_user_based_rating(uid,iid)

	


# 	#This function finds k similar items given the item_id and ratings matrix

	def findksimilaritems(item_id, ratings, metric=metric, k=k):
		similarities=[]
		indices=[]
		ratings=ratings.T
		loc = ratings.index.get_loc(item_id)
		model_knn = NearestNeighbors(metric = metric, algorithm = 'brute')
		model_knn.fit(ratings)
		distances, indices = model_knn.kneighbors(ratings.iloc[loc, :].values.reshape(1, -1), n_neighbors = k+1)
		similarities = 1-distances.flatten()
		return similarities,indices



# 	#This function predicts the rating for specified user-item combination based on item-based approach
	def predict_itembased(user_id, item_id, ratings, metric = metric, k=k):
		prediction= wtd_sum =0
		user_loc = ratings.index.get_loc(user_id)
		item_loc = ratings.columns.get_loc(item_id)
		similarities, indices=findksimilaritems(item_id, ratings) #similar users based on correlation coefficients
		sum_wt = np.sum(similarities)-1
		product=1
		for i in range(0, len(indices.flatten())):
			if indices.flatten()[i] == item_loc:
				continue;
			else:
				product = ratings.iloc[user_loc,indices.flatten()[i]] * (similarities[i])
				wtd_sum = wtd_sum + product  
		if sum_wt==0.0 :
			sum_wt=0.1
	#     print(wtd_sum,sum_wt," ",wtd_sum/sum_wt," ",int(round(wtd_sum/sum_wt)))
		prediction = int(round(wtd_sum/sum_wt))
	    
	    #in case of very sparse datasets, using correlation metric for collaborative based approach may give negative ratings
	    #which are handled here as below //code has been validated without the code snippet below, below snippet is to avoid negative
	    #predictions which might arise in case of very sparse datasets when using correlation metric
		if prediction <= 0:
			prediction = 1   
		elif prediction >10:
			prediction = 10

	    # print('\nPredicted rating for user {0} -> item {1}: {2}'.format(user_id,item_id,prediction) )     
		# print("Prediction itembased: ", prediction)
		return prediction

	@contextmanager
	def suppress_stdout():
		with open(os.devnull, "w") as devnull:
			old_stdout = sys.stdout
			sys.stdout = devnull
			try:  
				yield
			finally:
				sys.stdout = old_stdout
# 	#This function utilizes above functions to recommend items for item/user based approach and cosine/correlation. 
	
	def recommendItem2(user_id, ratings, metric=metric,recommendtype=1):    
		if (user_id not in ratings.index.values) or type(user_id) is not str:
			print("User id should be a valid integer from this list :")
		else:    
	#                     ids = ['Item-based (correlation)','Item-based (cosine)','User-based (correlation)','User-based (cosine)']
	#                     select = widgets.Dropdown(options=ids, value=ids[0],description='Select approach', width='1000px')
	                    
			clear_output(wait=True)
			prediction = []                                  
			metric = 'cosine'   
			with suppress_stdout():
				if(recommendtype==1): 
	                        #if (select.value == 'Item-based (correlation)') | (select.value == 'Item-based (cosine)'):
					for i in range(ratings.shape[1]):
						if (ratings[str(ratings.columns[i])][user_id] !=0): #not rated already
							prediction.append(predict_itembased(user_id, str(ratings.columns[i]) ,ratings, metric))
						else:                    
							prediction.append(-1) #for already rated items
				else:
					for i in range(ratings.shape[1]):
						if (ratings[str(ratings.columns[i])][user_id] !=0): #not rated already
							prediction.append(predict_userbased(user_id, str(ratings.columns[i]) ,ratings, metric))
						else:                    
							prediction.append(-1) #for already rated items
			# print("Prediction: ", prediction, user_id)
			prediction = pd.Series(prediction)
			prediction = prediction.sort_values(ascending=False)
			
			recommended = prediction[:10]
	#                     print("---------------------------------------------Hello------------------------------" )
	                    # print("As per  approach....Following products are recommended...")
	#                     print(recommended,recommended.dtypes)
	#                     print("---------------------------------------------Hello------------------------------" )
	#                     print(recommended.index[1],"len-",len(recommended))
	#                     print("---------------------------------------------Hello------------------------------" )
	#                     print("As per {0} approach....Following products are recommended...")
			recomend=''
	#                     print(products.bookTitle[recommended.index[1]].dtypes)
			for i in range(len(recommended)):
	#                          print("{0}. {1}".format(i+1,products.bookTitle[recommended.index[i]].encode('utf-8')))
				recomend=recomend+products.ISBN[recommended.index[i]]+' , '
	                         #recomend=recomend.append(recommended.index[i])
			# print("recomend", recomend)
			return recomend
	                

	def duplicate(words1,words2):
		words=[]
		for i in range(len(words1)):
			chk=1
			for j in range(len(words2)):
				if(words1[i]==words2[j]):
					del words2[j]
					chk=0
					break
	#         if(chk==1):
			words.append(words1[i])
		for j in range(len(words2)):
			words.append(words2[j])
		return words

	def new_user_recom():
		top=new_user_recommendation()
		top=top['ISBN']
		top=top.values
		return top


	def recom(userid):
		# print( "UserID Hahahahahaa ",userid)
		recomend=[]
		recomend.append(recommendItem2(userid, ratings_matrix))
		# print("Recomment id 1:", recomend)
		recomend.append(recommendItem2(userid, ratings_matrix,2))
	#     recomend=pd.DataFrame(recomend)
	#     recomend.astype(int64)
	#     recomend=recomend.unique()
	#     print(recomend.shape)
	#     rec=tostring(recomend)
		# print("Recommend", recomend[0].split(" , "))
		# print("Recommend 1", recomend[1].split(" , "))
		# print("Recommend 1", duplicate(recomend[0].split(" , "),recomend[1].split(" , ")))
		words1=recomend[0].split(" , ")
		words2=recomend[1].split(" , ")
		# if (words1[0]==words2[0]):
		# 	print("yes",len(words1)," ",len(words2))
		words=duplicate(words1,words2)

		# print("words", words)
	    #str1=''.join(str(e) for e in words)
		return words
	    
# #=========================================================================================
	userID = user_id
	# userID=21
	str1=[]
	chk=1
	recomendi=''
	# print("UserID"+ ratings.userID.values)
	if (userID not in ratings.userID.values) or type(userID) is not str:
		str12=new_user_recom()
		str12=str12.astype(int)
		chk=0
		for i in range(len(str12)):
			# print("ISBN", products.ISBN[str12[i]])
			recomendi=recomendi+products.ISBN[str12[i]]+','
		words1=recomendi.split(",")
		str1=words1
		# print(words1)
	    
	else:
		str1=recom(userID)
#===============================================================================================
	loyal=0
	print(str1)
	
#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

		
	# return render_template('recommend.html',lo=loyal,word=str1,word1=str2,name=names,book1=lis,book2=lid,book3=lit,book4=liq,book5=liw,book6=lir,predict4=predict1[0][0],predict5=predict2[0][0],predict6=predict3[0][0],discount1=predict11[0][0],discount2=predict22[0][0],discount3=predict33[0][0])


	#return render_template('recommend.html',word=str1)

	#     print(type(words))
	#     print(recomend[0])
	   
# recommend("")
recommend(sys.argv[1])
# recommend("63a7e195ed5884d1989f108a")