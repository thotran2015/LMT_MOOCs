import csv
import json
course_info_loc = "/Users/thotran/LMT_MOOCs/courseraforums/data/course_information.csv"
def processCourseInfo(course_info_loc):
    with open(course_info_loc, encoding="utf-8") as course_info:
        course_info_reader = csv.DictReader(course_info)
        data = {}
        type_map = {'Q': 'Quantitative', 'E': 'Education', 'S': 'Science', 'A': 'Arts', 'H': 'Humanities', 'B': 'Business', 'W': 'Writing', '?': 'Interdisciplinary'}
        language = {'E': 'English', 'SP': 'Spanish', 'FR': 'French', 'CH': 'Chinese'}
        for row in course_info_reader:
            course = dict()
            course['name'] = row.get('name')
            course['icon'] = row.get('course_id')
            course['cat'] = type_map[row.get('type')]
            course['lang'] = language[row.get('language')]
            course['value'] = row.get('num_users')
            course['desc'] = "Course: " + course.get('name') +'\n' + "Language: " + course.get('lang') +'\n' + "Duration: " + row.get('weeks') + ' weeks'
            data[row.get('course_id')] = course
    with open('class_info.json', mode='w') as outfile:
        json.dump(data, outfile)

course_threads_loc = "/Users/thotran/LMT_MOOCs/courseraforums/data/course_threads.csv"
def processThreads(course_threads_loc):
    with open(course_threads_loc, encoding = 'utf-8') as course_threads:
        course_threads_reader = csv.DictReader(course_threads)
        threads = {}
        for row in course_threads_reader:
##            if int(row.get('thread_id'))>800:
##                break
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
def processPosts(course_posts_loc):
    with open(course_posts_loc, encoding = 'utf-8') as course_posts:
        course_posts_reader = csv.DictReader(course_posts)
        posts = []
        for row in course_posts_reader:
##            if int(row.get('thread_id'))>30:
##                break
            post = dict()
            post['course_id']= row.get('course_id')
            post['time']= row.get('post_time')
            post['num_words']= row.get('num_words')
            post['category'] = row.get('user_type')
            post['thread_id'] = row.get('thread_id')
            posts.append(post)
        return posts
    
thread_map = {2: 'General (Miscellaneous) Discussion', 3: 'Assignments', 4: 'Study Groups / Meetups', 7: 'Course Feedback / Suggestions', 8: 'Lectures',  9: 'Platform Issues', 100: 'Signature Track'}
threads = processThreads(course_threads_loc)
def threadCount(course, file):
    course_thread ={}
    for thread in threads[course]:
        thread_topic = thread.get('og_forum')
        if thread_topic not in course_thread:
            course_thread[thread_topic] = [thread]
        else:
            course_thread[thread_topic].append(thread)
    total = len(sum(course_thread.values(), []))
    cleaned_threads = []
    for topic in course_thread:
        c_t = dict()
        c_t['course'] = course
        c_t['category'] = topic
        c_t['measure'] = len(course_thread.get(topic))/total
        cleaned_threads.append(c_t)
    with open(file, mode='w') as outfile:
        json.dump(cleaned_threads, outfile)
    return cleaned_threads
for course in threads:
    threadCount(course, course+'_list')
    
    
