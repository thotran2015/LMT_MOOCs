import csv
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
