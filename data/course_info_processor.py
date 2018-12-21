import csv
def processCourseInfo(course_info_loc):
    with open(course_info_loc, encoding="utf-8") as course_info:
        course_info_reader = csv.DictReader(course_info)
        type_map = {'Q': 'Quantitative', 'E': 'Education', 'S': 'Science', 'A': 'Arts', 'H': 'Humanities', 'B': 'Business', 'W': 'Writing', '?': 'Interdisciplinary'}
        language = {'E': 'English', 'SP': 'Spanish', 'FR': 'French', 'CH': 'Chinese'}
        courses = []
        for row in course_info_reader:
            course = dict()
            course['name'] = row.get('name')
            course['icon'] = row.get('course_id')
            course['cat'] = type_map[row.get('type')]
            course['lang'] = language[row.get('language')]
            course['value'] = row.get('num_users')
            course['desc'] = "Course: " + course.get('name') +'<br/>' + "Language: " + course.get('lang') +'<br/>' + "Duration: " + row.get('weeks') + ' weeks'+'<br/>'+ 'User count: '+row.get('num_users')
            courses.append(course)
        return courses
