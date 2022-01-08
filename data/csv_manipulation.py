import csv





def nari_dynamic_sample_export(number_of_rows=10,appendix="_sample_2"):

    mmsi_in_interest_count_dict = {}
    with open('nari_dynamic.csv') as input_csv_file:
        reader = csv.reader(input_csv_file)
      
        with open("nari_dynamic"+appendix+".csv", "w", newline='') as output_csv_file:
            writer = csv.writer(output_csv_file)
            count = 0
            line_count = 0
            break_flag = False
            for r in reader:
                if line_count == 0:
                    writer.writerow((r[0], r[6], r[7], r[8]))
                line_count += 1

                if r[0] not in mmsi_in_interest:
                    continue
                
                if r[0] in mmsi_in_interest_count_dict:
                    if mmsi_in_interest_count_dict[r[0]] == number_of_rows:
                        continue
                    mmsi_in_interest_count_dict[r[0]] += 1
                else:
                    mmsi_in_interest_count_dict[r[0]] = 1
                


                # [
                # 0 'sourcemmsi', 
                # 1 'navigationalstatus', 
                # 2 'rateofturn', 
                # 3 'speedoverground', 
                # 4 'courseoverground', 
                # 5 'trueheading', 
                # 6 'lon', 
                # 7 'lat', 
                # 8 't'
                # ]
                writer.writerow((r[0], r[6], r[7], r[8]))
                
                break_flag = True
                for key in mmsi_in_interest_count_dict:
                    if mmsi_in_interest_count_dict[key] < number_of_rows:
                        break_flag = False
                
                if break_flag:
                    break



#
#
#
def anfr_sample_export(appendix="_sample"):
    with open('anfr.csv','r',encoding='cp850') as input_csv_file:
        reader = csv.reader(input_csv_file,delimiter =';')
        count_lines = 0

        with open("anfr"+appendix+".csv","w", newline='') as output_csv_file:
            writer = csv.writer(output_csv_file)

            for r in reader:
                if count_lines == 0:
                    writer.writerow(r)
                    count_lines += 1
                if r[5] in mmsi_in_interest:
                    writer.writerow(r)
                    count_lines += 1
                
                if count_lines == len(mmsi_in_interest)+1:
                    break

#
#
# SET max_list_length = 0 if you want to return all data
#
def export_all_available_mmsi_in_nari_dynamic(max_list_length=20):
    mmsi_list = []
    with open('nari_dynamic.csv') as input_csv_file:
        reader = csv.reader(input_csv_file)
        count_lines = 0
        for r in reader:

            if count_lines == 0:
                count_lines += 1
                continue

            if r[0] not in mmsi_list:
                mmsi_list.append(r[0])
            
            count_lines += 1
            if max_list_length != 0:
                if len(mmsi_list) == max_list_length:
                    break

        return mmsi_list

if __name__ == "__main__":
    max_mmsi_list = 20
    max_nari_per_mmsi = 10
    mmsi_in_interest = export_all_available_mmsi_in_nari_dynamic(max_list_length=max_mmsi_list)
    nari_dynamic_sample_export(number_of_rows=max_nari_per_mmsi,appendix="_sample")
    anfr_sample_export(appendix="_sample")