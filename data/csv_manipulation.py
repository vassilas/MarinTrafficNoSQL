import csv
import pandas




def nari_dynamic_sample_export(number_of_rows=20,appendix="2"):

    mmsi_in_interest = ["245257000","228131600","245257000"]

    with open('nari_dynamic.csv') as input_csv_file:
        reader = csv.reader(input_csv_file)
      
        with open("nari_dynamic_sample_"+appendix+".csv", "w", newline='') as output_csv_file:
            writer = csv.writer(output_csv_file)
            count = 0
            for r in reader:
                if r[0] not in mmsi_in_interest:
                    continue
                count += 1
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

                if count == number_of_rows:
                    break

def example_1():
    with open('nari_dynamic.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                print(f'Column names are {", ".join(row)}')
                print(row)
                line_count += 1
            else:
                # print(row[2])
                line_count += 1
        print(f'Processed {line_count} lines.')


nari_dynamic_sample_export()