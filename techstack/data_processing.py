import csv
import json
course_info_loc = "/Users/thotran/LMT_MOOCs/courseraforums/data/course_information.csv"
def processCourseInfo(course_info_loc):
    with open(course_info_loc, encoding="utf-8") as course_info:
        course_info_reader = csv.DictReader(course_info)
        data = {}
        type_map = {'Q': 'Quantitative', 'E': 'Education', 'S': 'Science', 'A': 'Arts', 'H': 'Humanities', 'B': 'Business', 'W': 'Writing', '?': 'Interdisciplinary'}
        language = {'E': 'English', 'SP': 'Spanish', 'FR': 'French', 'CH': 'Chinese'}
        course_name = []
        for row in course_info_reader:
            course_name.append(row.get('name'))
            course = dict()
            course['name'] = row.get('name')
            course['icon'] = row.get('course_id')
            course['cat'] = type_map[row.get('type')]
            course['lang'] = language[row.get('language')]
            course['value'] = row.get('num_users')
            course['desc'] = "Course: " + course.get('name') +'\n' + "Language: " + course.get('lang') +'\n' + "Duration: " + row.get('weeks') + ' weeks'
            data[row.get('course_id')] = course
        return course_name
    with open('class_info.json', mode='w') as outfile:
        json.dump(data, outfile)
print(processCourseInfo(course_info_loc))
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
threads = processThreads(course_threads_loc)
def sortThread(threads):
    course_thread ={}
    for thread in threads[course]:
        thread_topic = thread.get('og_forum')
        if thread_topic not in course_thread:
            course_thread[thread_topic] = [thread]
        else:
            course_thread[thread_topic].append(thread)
    return course_thread
def threadCount(course, file):
    course_thread = sortThread(threads)
    total = len(sum(course_thread.values(), []))
    cleaned_threads = []
    for topic in course_thread:
        c_t = dict()
        c_t['course'] = course
        c_t['category'] = topic
        c_t['measure'] = len(course_thread.get(topic))/total
        c_t['thread_id'] = course_thread.get('thread_id')
        c_t['forum_id'] = course_thread.get('forum_id') 
        cleaned_threads.append(c_t)
    with open(file, mode='w') as outfile:
        json.dump(cleaned_threads, outfile)
    return cleaned_threads
for course in threads:
    threadCount(course, course+'_list')
    
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
        
#threadsBreakdownByForumTopics("lead-ei-001", "lead-ei-001_test1")      
        

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


##print(groupPostBy("lead-ei-001", "user_type", "postsOLead-ei-001").keys())

def userVSPostNum(course_id, feature, file):
    users = groupPostBy(course_id, feature)
    postsByUser = []
    total = len(sum(users.values(), []))
    for user in users:
        userPost = {}
        userPost['user_type'] = user 
        userPost['course_id'] = course_id
        userPost['measure'] = len(users.get(user))
        postsByUser.append(userPost)
    with open(file, mode='w') as outfile:
        json.dump(postsByUser, outfile)
    return postsByUser
##
##userVSPostNum("lead-ei-001", "user_type", 'leadPosts')
##userVSPostNum("assetpricing-001", "user_type", 'assetPosts')
##userVSPostNum("relationship-001", "user_type", 'relationshipPosts')
course_id = ["analysenumerique-001", "assetpricing-001", "automata-002","bigdata-edu-001", "bioinformatics-001", "blendedlearning-001", "bluebrain-001", 
"climateliteracy-002", "compilers-003", "compmethods-004", "crypto-008", "cyhfisica-001", "dataanalysis-002", "datasci-001", "design-003", "designingcities-001", 
"digitalmedia-001", "dsalgo-001", "dsp-002", "edc-002", "einstein-001", "finance-001", "friendsmoneybytes-002", "gametheory-003", "gamification-003", "genomescience-002",
"globalwarming-001", "hci-004", "historyofrock1-002", "humankind-001", "intro-cpp-fr-001","introjava-fr-001", "introeulaw-001", "intropsych-001", "introstats-001", 
"lead-ei-00", "linearprogramming-001", "mathematicalmethods-002", "mentalhealth-002", "ml-003", "nanotech-001", "neuralnets-2012-001", "nlangp-001", "onlinegames-001",
"organalysis-002", "pgm-003", "pkubioinfo-001", "pkuic-001", "precalc-001", "progfun-003", "programming1-002", "programming2-001", "relationship-001", "sciwrite-2012-001", 
"sna-003", "startup-001", "stats1-002", "usefulgenetics-002", "videogameslearning-001", "virology-001"]
for course in course_id:
    userVSPostNum(course, "user_type", course+"user_type")

    
    
        
        

            
    
    
        
        

    


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
    
        
