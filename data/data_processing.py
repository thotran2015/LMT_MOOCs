import csv
import json
import course_info_processor as c
course_id =['analysenumerique-001', 'assetpricing-001', 'automata-002', 'bigdata-edu-001', 'bioinformatics-001', 'blendedlearning-001', 'bluebrain-001', 'climateliteracy-002', 'compilers-003', 'compmethods-004', 'crypto-008', 'cyhfisica-001', 'dataanalysis-002', 'datasci-001', 'design-003', 'designingcities-001', 'digitalmedia-001', 'dsalgo-001', 'dsp-002', 'edc-002', 'einstein-001', 'finance-001', 'friendsmoneybytes-002', 'gametheory-003', 'gamification-003', 'genomescience-002', 'globalwarming-001', 'hci-004', 'historyofrock1-002', 'humankind-001', 'intro-cpp-fr-001', 'intro-java-fr-001', 'introeulaw-001', 'intropsych-001', 'introstats-001', 'lead-ei-001', 'linearprogramming-001', 'mathematicalmethods-002', 'mentalhealth-002', 'ml-003', 'nanotech-001', 'neuralnets-2012-001', 'nlangp-001', 'onlinegames-001', 'organalysis-002', 'pgm-003', 'pkubioinfo-001', 'pkuic-001', 'precalc-001', 'progfun-003', 'programming1-002', 'programming2-001', 'relationship-001', 'sciwrite-2012-001', 'sna-003', 'startup-001', 'stats1-002', 'usefulgenetics-002', 'videogameslearning-001', 'virology-001']
course_info_loc = "/Users/thotran/LMT_MOOCs/courseraforums/data/course_information.csv"
with open("course_bubbles",  mode ='w') as outfile:
    json.dump(c.processCourseInfo(course_info_loc), outfile)


    

course_threads_loc = "/Users/thotran/LMT_MOOCs/courseraforums/data/course_threads.csv"
def processThreads(course_threads_loc):
    with open(course_threads_loc, encoding = 'utf-8') as course_threads:
        course_threads_reader = csv.DictReader(course_threads)
        threads = {}
        for row in course_threads_reader:
            thread = dict()
            thread['course_id']= row.get('course_id')
            thread['thread_id'] = row.get('thread_id')
            thread['og_forum'] = row.get('og_forum')
            thread['forum_id'] = row.get('forum_id')
            if row.get('course_id') not in threads:
                threads[row.get('course_id')] = [thread]
            else:
                threads[row.get('course_id')].append(thread)
        return threads

course_posts_loc = '/Users/thotran/LMT_MOOCs/courseraforums/data/course_posts.csv'
thread_map = {2: 'General (Miscellaneous) Discussion', 3: 'Assignments', 4: 'Study Groups / Meetups', 7: 'Course Feedback / Suggestions', 8: 'Lectures',  9: 'Platform Issues', 100: 'Signature Track'}
def sortThread(course_threads_loc):
    threads = processThreads(course_threads_loc)
    course_thread ={}
    for thread in threads[course]:
        thread_topic = thread.get('og_forum')
        if thread_topic not in course_thread:
            course_thread[thread_topic] = [thread]
        else:
            course_thread[thread_topic].append(thread)
    return course_thread
def threadCount(course, file):
    course_thread = sortThread(course_threads_loc)
    total = len(sum(course_thread.values(), []))
    cleaned_threads = []
    for topic in course_thread:
        c_t = dict()
        c_t['course'] = course
        c_t['category'] = topic
        c_t['measure'] = len(course_thread.get(topic))/total
        c_t['thread_id'] = course_thread.get('thread_id')
        c_t['forum_id'] = course_thread.get('forum_id')
        c_t['thread_count'] = total
        cleaned_threads.append(c_t)
    with open(file, mode='w') as outfile:
        json.dump(cleaned_threads, outfile)
    return cleaned_threads

    
def processThreads1(course_threads_loc):
    with open(course_threads_loc, encoding = 'utf-8') as course_threads:
        course_threads_reader = csv.DictReader(course_threads)
        threads = []
        for row in course_threads_reader:
            thread = dict()
            thread['course_id']= row.get('course_id')
            thread['thread_id'] = row.get('thread_id')
            thread['og_forum'] = row.get('og_forum')
            thread['forum_id'] = row.get('forum_id')
            threads.append(thread)
        return threads
def filterThreads(course_id):
    threads = processThreads1(course_threads_loc)
    desired_threads = []
    for thread in threads:
        if thread.get('course_id') == course_id:
            desired_threads.append(thread)
    return desired_threads

def groupCourseThreadsByForumTopics(course_id):
    forums = {}
    for thread in filterThreads(course_id):
        if thread.get('og_forum') not in forums:
            forums[thread.get('og_forum')] = [thread]
        else:
            forums[thread.get('og_forum')].append(thread)
    return forums

def threadsBreakdownByForumTopics(course_id, file):
    thread_map = {2: 'General (Miscellaneous) Discussion', 3: 'Assignments', 4: 'Study Groups / Meetups', 7: 'Course Feedback / Suggestions', 8: 'Lectures',  9: 'Platform Issues', 100: 'Signature Track'}
    forums = groupCourseThreadsByForumTopics(course_id)
    forum_topics =[]
    total = len(sum(forums.values(), []))
    for f_topic in forums:
        forum = dict()
        forum['course_id'] = course_id
        forum['category'] = f_topic
        forum['measure'] = len(forums.get(f_topic))/total
        forum_topics.append(forum)
    with open(file, mode='w') as outfile:
        json.dump(forum_topics, outfile)

def processPosts(course_posts_loc):
    with open(course_posts_loc, encoding = 'utf-8') as course_posts:
        course_posts_reader = csv.DictReader(course_posts)
        posts =[]
        for row in course_posts_reader:
            post = dict()
            post['course_id']= row.get('course_id')
            post['time']= row.get('post_time')
            post['num_words']= row.get('num_words')
            post['category'] = row.get('user_type')
            post['forum_id'] = row.get('forum_id')
            post['user_type'] = row.get('user_type')
            posts.append(post)
        return posts

def filterPosts (course_id, thread_id):
    posts = processPosts(course_posts_loc)
    desired_posts = []
    for post in posts:
        if post.get('course_id') == course_id and post.get('thread_id') == thread_id:
            desired_posts.append(post)
##    with open(filtered_file, mode='w') as outfile:
##        json.dump(desired_posts, outfile)
    return desired_posts
# find posts based on the thread_id for a given forum topic
def groupPostByOg_forum(course_id, og_forum):
    forums = groupCourseThreadsByForumTopics(course_id)[og_forum]
    posts = []
    for f in forums:
        posts.extend(filterPosts (course_id, f.get('thread_id')))
##    with open(file, mode='w') as outfile:
##        json.dump(posts, outfile)
    return posts

def groupPostByUserType(course_id, og_forum, file="postsByUser"):
    users = {}
    for post in groupPostByOg_forum(course_id, og_forum):
        if post.get('user_type') not in users:
            users[post.get('user_type')] = [post]
        else:
            users[post.get('user_type')].append(post)
    with open(file, mode='w') as outfile:
        json.dump(users, outfile)

        
# thread processing

def processThreads(course_threads_loc):
    with open(course_threads_loc, encoding = 'utf-8') as course_threads:
        course_threads_reader = csv.DictReader(course_threads)
        threads = {}
        for row in course_threads_reader:
            thread = dict()
            thread['course_id']= row.get('course_id')
            thread['thread_id'] = row.get('thread_id')
            thread['og_forum'] = row.get('og_forum')
            thread['forum_id'] = row.get('forum_id')
            if row.get('course_id') not in threads:
                threads[row.get('course_id')] = [thread]
            else:
                threads[row.get('course_id')].append(thread)
        return threads

def groupThreadBy(course_id, feature):
    total_course_threads = processThreads(course_threads_loc).get(course_id)
    threads_by_names = {}
    out = []
    for thread in total_course_threads:
        if thread.get(feature) not in threads_by_names:
            threads_by_names[thread.get(feature)] = [thread]
        else:
            threads_by_names[thread.get(feature)].append(thread)
    for name in threads_by_names:
        forum = {}
        forum['course'] = course_id
        forum['category'] = name
        forum['measure'] = len(threads_by_names.get(name))/len(total_course_threads)
        forum['thread_total'] = len(total_course_threads)
        out.append(forum)
    return out
 
        
    

#group and sort posts

def groupPostBy(course_id, feature):
    post_by_course = {}
    with open(course_posts_loc, encoding = 'utf-8') as course_posts:
        course_posts_reader = csv.DictReader(course_posts)
        for post in course_posts_reader:
            if post.get('course_id') == course_id:
                if post.get(feature) not in post_by_course:
                    post_by_course[post.get(feature)] = [post]
                else:
                    post_by_course[post.get(feature)].append(post)

    return post_by_course

def userVSPostNum(course_id, feature, file):
    users = groupPostBy(course_id, feature)
    postsByUser = []
    total = len(sum(users.values(), []))
    for user in users:
        userPost = {}
        userPost['user_type'] = user 
        userPost['course_id'] = course_id
        userPost['measure'] = len(users.get(user))
        userPost['post_total'] = total
        postsByUser.append(userPost)
    with open(file, mode='w') as outfile:
        json.dump(postsByUser, outfile)
    return postsByUser

##dataBarChart = []
##for course in course_id:
##    dataBarChart.extend(userVSPostNum(course, "user_type", course+"user_type"))
##
##with open("user_type_courses", mode='w') as outfile:
##    json.dump(dataBarChart, outfile)
##    
##
##threads_by_topics =[]
##for course in course_id:
##    threads_by_topics.extend(threadCount(course, course+'_list'))
##with open("thread_by_topics", mode='w') as outfile:
##    json.dump(threads_by_topics, outfile)
    
##threads_by_ftopics =[]
##for course in course_id:
##    threads_by_ftopics.extend(groupThreadBy(course, 'og_forum'))
##with open("thread_by_ftopics", mode='w') as outfile:
##    json.dump(threads_by_ftopics, outfile) 
        
        

            
    
    
        
        

    


##asset_posts = filterPosts('assetpricing-001', '3', 'filtered_posts')
##def sortPostByUserType(asset_posts):
##    sorted_posts ={}
##    for post in asset_posts:
##        if post.get('user_type') not in sorted_posts:
##            sorted_posts[post.get('user_type')] = [post]
##        else:
##            sorted_posts[post.get('user_type')].append(post)
##    return sorted_posts

    
        
        
            
    
##def threadCount(course, file):
##    course_threads = sortThread(threads)
##    
##    for forum_topic in course_threads:
##        post_by_topics = {}
##        for p in course_threads.get(forum_topic):
##            if p.get('forum_id') not in post_by_topics:
##                post_by_topics[p.get('forum_id')]
##                
##        
##        if topin not in posts:
##            post[thread['forum_id']] = [posts]
##        else:
##            
    
        
